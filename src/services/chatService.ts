import { apiChatAdapter } from '@/services/chat/apiChatAdapter';
import { mockChatAdapter } from '@/services/chat/mockChatAdapter';
import { createPollingChatRealtime } from '@/services/chat/pollingChatRealtime';
import type { ChatAdapter } from '@/types/chat';

const chatAdapters: Partial<Record<string, ChatAdapter>> = {
  mock: mockChatAdapter,
  api: apiChatAdapter,
};

function selectChatAdapter(): ChatAdapter {
  return chatAdapters[process.env.NEXT_PUBLIC_CHAT_ADAPTER ?? 'mock'] ?? mockChatAdapter;
}

const adapter = selectChatAdapter();

export const conversationService = adapter.conversations;
export const messageService = adapter.messages;
export const friendService = adapter.friends;
export const userService = adapter.users;
export const chatRealtime = createPollingChatRealtime(adapter);
