'use client';

import { useCallback, useState } from 'react';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { chatRequiresLogin } from '@/services/chatService';

import { CHAT_CANVAS_CLASS } from './chatLayout';
import { chatAccessOf } from './chatLogin';
import ChatLoginRequired from './ChatLoginRequired';
import ChatScreen from './ChatScreen';

export default function ChatAccess() {
  const loggedIn = useIsLoggedIn();
  const [sessionExpired, setSessionExpired] = useState(false);
  const expireSession = useCallback(() => setSessionExpired(true), []);
  const access = chatAccessOf(chatRequiresLogin, loggedIn, sessionExpired);

  if (access === 'checking') return <div className={CHAT_CANVAS_CLASS} />;
  if (access === 'login') return <ChatLoginRequired />;
  return <ChatScreen onUnauthorized={expireSession} />;
}
