import { ApiError } from '@/lib/api';

export const NETWORK_ERROR_MESSAGE = '서버와 연결할 수 없어요. 잠시 후 다시 시도해 주세요.';

/**
 * 서버가 직접 보낸 4xx 문구(예: 비밀번호 불일치, 인증번호 만료)만 돌려주고, 그 밖의 경우는 undefined 입니다.
 * 서버 오류(5xx)·JSON 이 아닌 응답(프록시 미설정 404 등)·네트워크 오류는 서버 문구가 아닌 것으로 봅니다.
 */
export function getServerErrorMessage(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  // 응답이 JSON 이 아니거나 message 가 없으면 lib/api/client.ts 가 이 기본 문구를 넣습니다.
  // (client.ts 의 문구가 바뀌면 여기도 함께 바꿔야 합니다)
  const isFallbackMessage = error.message === `요청에 실패했습니다. (${error.status})`;
  if (error.status >= 500 || isFallbackMessage) return undefined;
  return error.message;
}

/**
 * Auth API 실패 시 화면에 보여줄 문구를 고릅니다. (로그인, 회원가입, 비밀번호 찾기·재설정에서 함께 사용)
 * 서버 문구가 있으면 그대로 쓰고, 없으면 연결 오류 문구로 바꿉니다.
 */
export function getAuthErrorMessage(error: unknown): string {
  return getServerErrorMessage(error) ?? NETWORK_ERROR_MESSAGE;
}
