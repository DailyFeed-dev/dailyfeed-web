import { io, type Socket } from 'socket.io-client';

import type { ChatSyncSignal } from '@/services/chat/pollingChatRealtime';

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

export function createSocketChatSignal({
  url,
  path,
  getJoinPayload,
  joinedIntervalMs,
  fallbackIntervalMs,
}: SocketChatSignalOptions): ChatSyncSignal {
  const listeners = new Set<() => void>();
  let socket: Socket | null = null;
  let joined = false;
  let attempt = 0;

  const pokeAll = () => {
    for (const listener of [...listeners]) listener();
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
  };

  const close = () => {
    socket?.disconnect();
    socket = null;
    forgetJoin();
  };

  return {
    intervalMs: () => (joined ? joinedIntervalMs : fallbackIntervalMs),
    subscribe(onPoke) {
      listeners.add(onPoke);
      if (!socket) open();
      return () => {
        listeners.delete(onPoke);
        if (listeners.size === 0) close();
      };
    },
  };
}
