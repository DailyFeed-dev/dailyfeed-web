import { NEXT_PARAM } from '@/components/auth/nextPath';
import { ApiError } from '@/lib/api';

const CHAT_PATH = '/chat';
const LOGIN_PATH = '/login';
const UNAUTHORIZED = 401;

export type ChatAccess = 'checking' | 'login' | 'ready';

export function chatAccessOf(
  requiresLogin: boolean,
  loggedIn: boolean | null,
  sessionExpired: boolean,
): ChatAccess {
  if (!requiresLogin) return 'ready';
  if (loggedIn === null) return 'checking';
  return loggedIn && !sessionExpired ? 'ready' : 'login';
}

export function chatLoginHref(query: string) {
  const returnTo = query ? `${CHAT_PATH}?${query}` : CHAT_PATH;
  return `${LOGIN_PATH}?${NEXT_PARAM}=${encodeURIComponent(returnTo)}`;
}

export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === UNAUTHORIZED;
}
