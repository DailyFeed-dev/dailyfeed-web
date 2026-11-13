import { NEXT_PARAM } from '@/components/auth/nextPath';
import { ApiError } from '@/lib/api';

const CHAT_PATH = '/chat';
const LOGIN_PATH = '/login';
const UNAUTHORIZED = 401;

export type ChatAccess = 'checking' | 'login' | 'ready';

export function chatAccessOf(
  requiresLogin: boolean,
  token: string | null | undefined,
  expiredToken: string | null | undefined,
): ChatAccess {
  if (!requiresLogin) return 'ready';
  if (token === undefined) return 'checking';
  if (token === null || token === expiredToken) return 'login';
  return 'ready';
}

export function chatLoginHref(query: string) {
  const returnTo = query ? `${CHAT_PATH}?${query}` : CHAT_PATH;
  return `${LOGIN_PATH}?${NEXT_PARAM}=${encodeURIComponent(returnTo)}`;
}

export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === UNAUTHORIZED;
}
