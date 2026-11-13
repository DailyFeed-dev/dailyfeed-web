import { useCallback, useState, useSyncExternalStore } from 'react';

import { tokenStorage } from '@/lib/api';

import { chatAccessOf } from './chatLogin';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

const readToken = () => tokenStorage.getAccessToken();
const readServerToken = () => undefined;

export function useChatAccess(requiresLogin: boolean) {
  const token = useSyncExternalStore(subscribe, readToken, readServerToken);
  const [expiredToken, setExpiredToken] = useState<string | null | undefined>(undefined);
  const expireSession = useCallback(() => setExpiredToken(tokenStorage.getAccessToken()), []);

  return { access: chatAccessOf(requiresLogin, token, expiredToken), expireSession };
}
