import { api, tokenStorage, type Schemas } from '@/lib/api';

/**
 * Auth API 함수입니다. (이슈 #4)
 * 화면 컴포넌트는 api 를 직접 부르지 않고 이 파일의 함수만 사용합니다.
 * 로그인·회원가입·비밀번호 찾기 요청에는 아직 토큰이 없으므로 skipAuth 로 Authorization 헤더를 붙이지 않습니다.
 */

/** 로그인에 성공하면 토큰을 저장하고 응답(사용자 정보 포함)을 돌려줍니다. 실패하면 ApiError 를 던집니다. */
export async function login(body: Schemas['LoginRequest']): Promise<Schemas['AuthResponse']> {
  const auth = await api.post<Schemas['AuthResponse']>('/api/v1/auth/login', body, {
    skipAuth: true,
  });
  tokenStorage.setTokens(auth);
  return auth;
}

/**
 * 비밀번호 재설정 보안키를 메일로 보내 달라고 요청합니다.
 * 계정이 있는지 알려 주지 않는 API 라서, 가입되지 않은 이메일이어도 성공으로 끝납니다.
 * 응답의 demoToken(테스트 서버 전용)이 화면에 쓰이지 않도록 응답은 돌려주지 않습니다.
 */
export async function forgotPassword(body: Schemas['ForgotPasswordRequest']): Promise<void> {
  await api.post<Schemas['ForgotPasswordResponse']>('/api/v1/auth/password/forgot', body, {
    skipAuth: true,
  });
}

/**
 * 메일로 받은 보안키와 새 비밀번호로 비밀번호를 바꿉니다.
 * 성공하면 서버가 이 계정의 모든 로그인 세션을 끊으므로, 이 브라우저에 남은 토큰도 지웁니다.
 */
export async function resetPassword(body: Schemas['ResetPasswordRequest']): Promise<void> {
  await api.post('/api/v1/auth/password/reset', body, { skipAuth: true });
  tokenStorage.clear();
}

/**
 * 회원가입 전 이메일 인증번호를 보내 달라고 요청합니다. 이미 가입된 이메일이면 409 ApiError 를 던집니다.
 * 응답의 demoCode(테스트 서버 전용)가 화면에 쓰이지 않도록 응답은 돌려주지 않습니다.
 */
export async function sendEmailCode(body: Schemas['SendEmailCodeRequest']): Promise<void> {
  await api.post<Schemas['SendEmailCodeResponse']>('/api/v1/auth/email/send-code', body, {
    skipAuth: true,
  });
}

/** 메일로 받은 인증번호가 맞는지 확인하고 결과(verified)를 돌려줍니다. 인증번호는 한 번만 쓸 수 있습니다. */
export async function verifyEmailCode(body: Schemas['VerifyEmailCodeRequest']): Promise<boolean> {
  const result = await api.post<Schemas['VerifyEmailCodeResponse']>(
    '/api/v1/auth/email/verify-code',
    body,
    { skipAuth: true },
  );
  return result.verified === true;
}

/**
 * 회원가입합니다. 응답은 로그인과 같은 AuthResponse 라서 로그인처럼 토큰을 저장하고 응답을 돌려줍니다.
 * (계정 상태가 ACTIVE 가 아니면 화면에서 토큰을 지웁니다. accountRole 은 보내지 않습니다)
 */
export async function register(body: Schemas['RegisterRequest']): Promise<Schemas['AuthResponse']> {
  const auth = await api.post<Schemas['AuthResponse']>('/api/v1/auth/register', body, {
    skipAuth: true,
  });
  tokenStorage.setTokens(auth);
  return auth;
}
