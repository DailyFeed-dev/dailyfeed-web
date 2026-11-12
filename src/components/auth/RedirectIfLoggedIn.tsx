'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getPostLoginPath } from '@/components/auth/nextPath';
import { tokenStorage } from '@/lib/api';

/**
 * 이미 로그인한 사용자가 로그인·회원가입 화면에 오면 ?next= 주소(없으면 메인)로 보냅니다. 화면에는 아무것도 그리지 않습니다.
 * 로그인 여부는 메인의 LoginRequiredLink 와 같이 access token 이 있는지로 판단합니다.
 *
 * Effect 로 검사하므로 첫 화면이 그려진 뒤에 실행됩니다. 그래서 이동하기 전 잠깐 폼이 보일 수 있습니다.
 * cacheComponents 가 이 화면을 숨겼다가 다시 보여줄 때도 Effect 가 다시 실행되어 매번 검사합니다.
 */
export default function RedirectIfLoggedIn() {
  const router = useRouter();

  useEffect(() => {
    if (tokenStorage.getAccessToken()) router.replace(getPostLoginPath());
  }, [router]);

  return null;
}
