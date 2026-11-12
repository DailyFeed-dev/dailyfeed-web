import { useSyncExternalStore } from 'react';

import { tokenStorage } from '@/lib/api';

/**
 * 헤더에서 로그인 여부를 알려 주는 훅입니다.
 * - 로그인 여부는 팀 공용 tokenStorage 에 로그인 토큰이 있는지로 판단해요. (LoginRequiredLink · RedirectIfLoggedIn 과 같은 기준)
 * - 서버에서 그릴 때는 브라우저 저장소를 볼 수 없어서 null(아직 모름)을 돌려줘요.
 *   null 일 때는 아무것도 그리지 않아서, 로그인한 사람에게 "로그인" 버튼이 잠깐 보이는 깜빡임을 막아요.
 * - 다른 탭에서 로그인 · 로그아웃해도 storage 이벤트로 바로 반영돼요.
 *
 * @returns true: 로그인됨 · false: 로그인 안 됨 · null: 아직 모름(서버 · 첫 화면)
 */
export default function useIsLoggedIn(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function getSnapshot(): boolean {
  return tokenStorage.getAccessToken() !== null;
}

function getServerSnapshot(): null {
  return null;
}
