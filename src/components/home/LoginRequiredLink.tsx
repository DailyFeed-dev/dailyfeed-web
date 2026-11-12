'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';

import { tokenStorage } from '@/lib/api';

/**
 * 로그인이 필요한 화면으로 가는 링크.
 * - 로그인되어 있으면: 원래 주소(href)로 그대로 이동
 * - 로그인 전이면: 로그인 화면으로 보내고, 로그인 후 돌아올 주소를 ?next= 로 함께 넘겨요.
 *   예) /chat → /login?next=%2Fchat
 *
 * 로그인 여부는 팀 공용 tokenStorage 의 로그인 토큰이 있는지로 판단해요. (브라우저 저장소라 클라이언트 컴포넌트)
 *
 * TODO: 로그인 화면이 ?next= 를 읽어 로그인 후 그 주소로 보내 주도록 로그인 담당(#4)에 요청.
 *       (지금 로그인 화면은 성공하면 항상 메인(/)으로 이동해요)
 * TODO(common): 다른 화면에서도 필요해지면 common/ 으로 옮기기
 */
export default function LoginRequiredLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 새 탭 열기(Ctrl/⌘ + 클릭 등)는 브라우저 기본 동작에 맡겨요
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (tokenStorage.getAccessToken()) return; // 로그인 상태 → Link 가 href 로 이동
    e.preventDefault();
    router.push(`/login?next=${encodeURIComponent(href)}`);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
