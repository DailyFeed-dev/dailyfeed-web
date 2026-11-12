import { api, tokenStorage, type Schemas } from '@/lib/api';

/**
 * Auth API 함수입니다. (이슈 #4)
 * 화면 컴포넌트는 api 를 직접 부르지 않고 이 파일의 함수만 사용합니다.
 * 로그인·비밀번호 찾기 요청에는 아직 토큰이 없으므로 skipAuth 로 Authorization 헤더를 붙이지 않습니다.
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
