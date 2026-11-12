import { tokenStorage } from '@/lib/api';
import { apiChatAdapter } from '@/services/chat/apiChatAdapter';
import { mockChatAdapter, mockTypingFeed } from '@/services/chat/mockChatAdapter';
import {
  createPollingChatRealtime,
  fixedIntervalSignal,
  noTypingFeed,
  type ChatSyncSignal,
  type ChatTypingFeed,
} from '@/services/chat/pollingChatRealtime';
import { createSocketChatSignal, type ChatJoinPayload } from '@/services/chat/socketChatSignal';
import type { ChatAdapter } from '@/types/chat';

const POLL_INTERVAL_MS = 3000;
const SOCKET_SAFETY_INTERVAL_MS = 10000;
const SOCKET_PATH = '/api/socket';

const chatAdapters: Partial<Record<string, ChatAdapter>> = {
  mock: mockChatAdapter,
  api: apiChatAdapter,
};

function selectChatAdapter(): ChatAdapter {
  return chatAdapters[process.env.NEXT_PUBLIC_CHAT_ADAPTER ?? 'mock'] ?? mockChatAdapter;
}

const adapter = selectChatAdapter();

function requireAccessToken() {
  const accessToken = tokenStorage.getAccessToken();
  if (!accessToken) throw new Error('로그인이 필요합니다.');
  return accessToken;
}

async function getJoinPayload(): Promise<ChatJoinPayload> {
  requireAccessToken();
  const me = await adapter.users.getMe();
  return { accessToken: requireAccessToken(), userId: String(me.id), userName: me.name };
}

type RealtimeSources = {
  sync: ChatSyncSignal;
  typing: ChatTypingFeed;
};

function selectRealtimeSources(): RealtimeSources {
  const polling = fixedIntervalSignal(POLL_INTERVAL_MS);
  if (adapter === mockChatAdapter) return { sync: polling, typing: mockTypingFeed };
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL;
  if (adapter !== apiChatAdapter || !socketUrl) return { sync: polling, typing: noTypingFeed };
  const socket = createSocketChatSignal({
    url: socketUrl,
    path: SOCKET_PATH,
    getJoinPayload,
    joinedIntervalMs: SOCKET_SAFETY_INTERVAL_MS,
    fallbackIntervalMs: POLL_INTERVAL_MS,
  });
  return { sync: socket, typing: socket };
}

const realtimeSources = selectRealtimeSources();

export const conversationService = adapter.conversations;
export const messageService = adapter.messages;
export const friendService = adapter.friends;
export const userService = adapter.users;
export const typingService = adapter.typing;
export const chatRealtime = createPollingChatRealtime(
  adapter,
  realtimeSources.sync,
  realtimeSources.typing,
);
