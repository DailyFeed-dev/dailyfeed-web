'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

import { NEXT_PARAM, readNextPath } from '@/components/auth/nextPath';

type AuthNextLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  /** 쿼리 없는 경로 (예: /signup) */
  href: string;
};

/**
 * 로그인 ↔ 회원가입 화면을 오갈 때 지금 주소의 ?next= 를 이어서 넘기는 링크입니다.
 * 예) /login?next=%2Fchat 에서 "회원가입" → /signup?next=%2Fchat
 *
 * next 는 클릭하는 순간 주소창에서 읽습니다. 렌더링 때 읽으면 서버 HTML(쿼리 모름)과 달라지기 때문입니다.
 * 그래서 새 탭 열기(Ctrl/⌘ + 클릭 등)에는 next 가 붙지 않고 기본 주소로 열립니다.
 */
export default function AuthNextLink({ href, onClick, ...props }: AuthNextLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    // 새 탭 열기 등은 브라우저 기본 동작에 맡깁니다.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    const next = readNextPath();
    if (!next) return; // next 가 없으면 Link 가 href 로 그대로 이동합니다.
    event.preventDefault();
    router.push(`${href}?${NEXT_PARAM}=${encodeURIComponent(next)}`);
  }

  return <Link {...props} href={href} onClick={handleClick} />;
}
