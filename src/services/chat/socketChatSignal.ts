import { io, type Socket } from 'socket.io-client';

import type { ChatSyncSignal, ChatTypingFeed } from '@/services/chat/pollingChatRealtime';
import type { ChatUserId } from '@/types/chat';

export type ChatJoinPayload = {
  accessToken: string;
  userId: string;
  userName: string;
};

type SocketChatSignalOptions = {
  url: string;
  path: string;
  getJoinPayload: () => Promise<ChatJoinPayload>;
  joinedIntervalMs: number;
  fallbackIntervalMs: number;
};

type TypingListener = (typing: boolean) => void;

function readTypingEvent(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) return null;
  const { user, typing } = payload as { user?: { id?: unknown }; typing?: unknown };
  const userId = Number(user?.id);
  if (!Number.isInteger(userId) || typeof typing !== 'boolean') return null;
  return { userId, typing };
}

export function createSocketChatSignal({
  url,
  path,
  getJoinPayload,
  joinedIntervalMs,
  fallbackIntervalMs,
}: SocketChatSignalOptions): ChatSyncSignal & ChatTypingFeed {
  const pokeListeners = new Set<() => void>();
  const typingListeners = new Map<ChatUserId, Set<TypingListener>>();
  let socket: Socket | null = null;
  let joined = false;
  let attempt = 0;

  const pokeAll = () => {
    for (const listener of [...pokeListeners]) listener();
  };

  const notifyTyping = (payload: unknown) => {
    const event = readTypingEvent(payload);
    if (!event) return;
    for (const listener of [...(typingListeners.get(event.userId) ?? [])]) listener(event.typing);
  };

  const forgetJoin = () => {
    attempt += 1;
    joined = false;
  };

  const join = async (current: Socket) => {
    forgetJoin();
    const myAttempt = attempt;
    const isLatest = () => socket === current && current.connected && attempt === myAttempt;
    try {
      const payload = await getJoinPayload();
      if (!isLatest()) return;
      current.emit('join', payload);
      joined = true;
    } catch {
      if (!isLatest()) return;
    }
    pokeAll();
  };

  const open = () => {
    const current = io(url, { path, transports: ['websocket', 'polling'], withCredentials: true });
    socket = current;
    current.on('connect', () => void join(current));
    current.on('disconnect', forgetJoin);
    current.on('chat:message', pokeAll);
    current.on('chat:typing', notifyTyping);
  };

  const close = () => {
    socket?.disconnect();
    socket = null;
    forgetJoin();
  };

  const openIfNeeded = () => {
    if (!socket) open();
  };

  const closeIfUnused = () => {
    if (pokeListeners.size === 0 && typingListeners.size === 0) close();
  };

  return {
    intervalMs: () => (joined ? joinedIntervalMs : fallbackIntervalMs),

    subscribe(onPoke) {
      pokeListeners.add(onPoke);
      openIfNeeded();
      return () => {
        pokeListeners.delete(onPoke);
        closeIfUnused();
      };
    },

    subscribeTyping(peerId, onTyping) {
      const listeners = typingListeners.get(peerId) ?? new Set<TypingListener>();
      listeners.add(onTyping);
      typingListeners.set(peerId, listeners);
      openIfNeeded();
      return () => {
        listeners.delete(onTyping);
        if (listeners.size === 0 && typingListeners.get(peerId) === listeners) {
          typingListeners.delete(peerId);
        }
        closeIfUnused();
      };
    },
  };
}
