import { NEXT_PARAM } from '@/components/auth/nextPath';
import { ApiError } from '@/lib/api';

// 로그인이 필요한 응답(401)인지 확인합니다.
export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

// 로그인 화면 주소. 로그인하면 returnTo(지금 보던 게시판 주소)로 돌아옵니다.
export function boardLoginHref(returnTo: string) {
  return `/login?${NEXT_PARAM}=${encodeURIComponent(returnTo)}`;
}
