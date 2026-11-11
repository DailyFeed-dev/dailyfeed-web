import { tokenStorage } from '@/lib/api';
import { apiChatAdapter } from '@/services/chat/apiChatAdapter';
import { mockChatAdapter } from '@/services/chat/mockChatAdapter';
import {
  createPollingChatRealtime,
  fixedIntervalSignal,
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

async function getJoinPayload(): Promise<ChatJoinPayload> {
  const accessToken = tokenStorage.getAccessToken();
  if (!accessToken) throw new Error('로그인이 필요합니다.');
  const me = await adapter.users.getMe();
  return { accessToken, userId: me.id, userName: me.name };
}

function selectSyncSignal() {
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL;
  if (adapter !== apiChatAdapter || !socketUrl) return fixedIntervalSignal(POLL_INTERVAL_MS);
  return createSocketChatSignal({
    url: socketUrl,
    path: SOCKET_PATH,
    getJoinPayload,
    joinedIntervalMs: SOCKET_SAFETY_INTERVAL_MS,
    fallbackIntervalMs: POLL_INTERVAL_MS,
  });
}

export const conversationService = adapter.conversations;
export const messageService = adapter.messages;
export const friendService = adapter.friends;
export const userService = adapter.users;
export const chatRealtime = createPollingChatRealtime(adapter, selectSyncSignal());
