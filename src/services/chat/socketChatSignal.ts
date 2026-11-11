import { io, type Socket } from 'socket.io-client';

import type { ChatSyncSignal } from '@/services/chat/pollingChatRealtime';

export type ChatJoinPayload = {
  accessToken: string;
  userId: number;
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

  const pokeAll = () => {
    for (const listener of [...listeners]) listener();
  };

  const join = async (current: Socket) => {
    joined = false;
    try {
      const payload = await getJoinPayload();
      if (socket === current && current.connected) {
        current.emit('join', payload);
        joined = true;
      }
    } catch {
      joined = false;
    }
    pokeAll();
  };

  const open = () => {
    const current = io(url, { path });
    socket = current;
    current.on('connect', () => void join(current));
    current.on('disconnect', () => {
      joined = false;
    });
    current.on('chat:message', pokeAll);
  };

  const close = () => {
    socket?.disconnect();
    socket = null;
    joined = false;
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
