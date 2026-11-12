/**
 * Auth 폼(로그인, 회원가입, 비밀번호 재설정)에서 함께 쓰는 입력값 검증 함수입니다.
 * 문제가 있으면 화면에 보여줄 에러 문구를, 없으면 undefined 를 돌려줍니다.
 */

// 아주 기본적인 형식만 확인합니다. (실제 가입 여부·유효성은 백엔드가 판단합니다)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return '이메일을 입력해 주세요.';
  if (!EMAIL_PATTERN.test(email)) return '올바른 이메일 형식을 입력해 주세요.';
  return undefined;
}

// 임시 규칙입니다. 백엔드의 비밀번호 규칙을 확인한 뒤 조정할 예정입니다.
export const PASSWORD_MIN_LENGTH = 8;

// 빈 값 문구는 화면의 라벨에 맞춥니다. (재설정: "새 비밀번호", 회원가입: "비밀번호")
export function validateNewPassword(
  value: string,
  emptyMessage = '새 비밀번호를 입력해 주세요.',
): string | undefined {
  if (!value.trim()) return emptyMessage;
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`;
  }
  return undefined;
}

export function validatePasswordConfirm(
  value: string,
  password: string,
  emptyMessage = '새 비밀번호를 다시 입력해 주세요.',
): string | undefined {
  if (!value.trim()) return emptyMessage;
  if (value !== password) return '비밀번호가 일치하지 않아요.';
  return undefined;
}

export const EMAIL_CODE_LENGTH = 6;
// 숫자 EMAIL_CODE_LENGTH(6)자리입니다.
const EMAIL_CODE_PATTERN = /^\d{6}$/;

export function validateEmailCode(value: string): string | undefined {
  const code = value.trim();
  if (!code) return '인증번호를 입력해 주세요.';
  if (!EMAIL_CODE_PATTERN.test(code)) return `인증번호 ${EMAIL_CODE_LENGTH}자리를 입력해 주세요.`;
  return undefined;
}
