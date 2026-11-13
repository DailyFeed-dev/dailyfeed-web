'use client';

import { chatRequiresLogin } from '@/services/chatService';

import { CHAT_CANVAS_CLASS } from './chatLayout';
import ChatLoginRequired from './ChatLoginRequired';
import ChatScreen from './ChatScreen';
import { useChatAccess } from './useChatAccess';

export default function ChatAccess() {
  const { access, expireSession } = useChatAccess(chatRequiresLogin);

  if (access === 'checking') return <div className={CHAT_CANVAS_CLASS} />;
  if (access === 'login') return <ChatLoginRequired />;
  return <ChatScreen onUnauthorized={expireSession} />;
}
