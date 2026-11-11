import { api, tokenStorage, type Schemas } from '@/lib/api';

/**
 * 로그인 API 함수입니다. (이슈 #4)
 * 화면 컴포넌트는 api 를 직접 부르지 않고 이 파일의 함수만 사용합니다.
 */

/** 로그인에 성공하면 토큰을 저장하고 응답(사용자 정보 포함)을 돌려줍니다. 실패하면 ApiError 를 던집니다. */
export async function login(body: Schemas['LoginRequest']): Promise<Schemas['AuthResponse']> {
  // 로그인 요청에는 아직 토큰이 없으므로 skipAuth 로 Authorization 헤더를 붙이지 않습니다.
  const auth = await api.post<Schemas['AuthResponse']>('/api/v1/auth/login', body, {
    skipAuth: true,
  });
  tokenStorage.setTokens(auth);
  return auth;
}
