import type { Schemas } from '@/lib/api';

type AccountStatus = Schemas['AuthResponse']['accountStatus'];

// 로그인·회원가입 API 는 성공했지만 아직 서비스를 쓸 수 없는 계정 상태와 안내 문구입니다.
// 'ACTIVE' 만 서비스를 쓸 수 있고, 여기에 없는 값은 UNKNOWN_ACCOUNT_STATUS_MESSAGE 를 보여줍니다.
const BLOCKED_ACCOUNT_MESSAGES: Partial<Record<NonNullable<AccountStatus>, string>> = {
  PENDING_APPROVAL: '가입 승인 대기 중인 계정이에요. 승인 후 로그인할 수 있어요.',
  REJECTED: '가입이 승인되지 않은 계정이에요.',
};
const UNKNOWN_ACCOUNT_STATUS_MESSAGE = '로그인할 수 없는 계정 상태예요. 관리자에게 문의해 주세요.';

/**
 * 로그인·회원가입 응답의 계정 상태를 확인합니다.
 * ACTIVE 면 undefined 를, 서비스를 쓸 수 없는 상태면 화면에 보여줄 안내 문구를 돌려줍니다.
 */
export function getBlockedAccountMessage(status: AccountStatus): string | undefined {
  if (status === 'ACTIVE') return undefined;
  return (status && BLOCKED_ACCOUNT_MESSAGES[status]) || UNKNOWN_ACCOUNT_STATUS_MESSAGE;
}
