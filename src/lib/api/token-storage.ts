/**
 * 로그인 토큰 저장소입니다.
 *
 * 지금은 가장 단순한 방식(브라우저 localStorage)을 사용합니다.
 * 나중에 쿠키 등 더 안전한 방식으로 바꿀 때는 이 파일만 수정하면 됩니다. (담당: 로그인 기능)
 */
const ACCESS_KEY = 'dailyfeed.accessToken';
const REFRESH_KEY = 'dailyfeed.refreshToken';

const isBrowser = () => typeof window !== 'undefined';

export const tokenStorage = {
  getAccessToken(): string | null {
    return isBrowser() ? window.localStorage.getItem(ACCESS_KEY) : null;
  },
  getRefreshToken(): string | null {
    return isBrowser() ? window.localStorage.getItem(REFRESH_KEY) : null;
  },
  /** 로그인/토큰 갱신 응답을 받은 뒤 호출합니다. */
  setTokens(tokens: { accessToken?: string; refreshToken?: string }) {
    if (!isBrowser()) return;
    if (tokens.accessToken) window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    if (tokens.refreshToken) window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  },
  /** 로그아웃 또는 토큰 갱신 실패 시 호출합니다. */
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};
