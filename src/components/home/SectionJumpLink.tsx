'use client';

import type { MouseEvent, ReactNode } from 'react';

/**
 * 같은 페이지 안의 섹션으로 내려가는 링크 (예: 히어로 "둘러보기" → #why-til).
 * - 누를 때마다 직접 그 섹션까지 부드럽게 스크롤해요. ("동작 줄이기" 사용자에게는 바로 이동)
 *   주소가 이미 #why-til 인 상태(맨 위로 버튼을 누른 뒤 등)에서도 다시 움직여요.
 * - 멈추는 위치는 섹션의 scroll-mt(헤더에 가리지 않게 둔 여유)를 따라요.
 * - 자바스크립트가 아직 안 켜졌을 때도 href 덕분에 일반 링크처럼 동작해요.
 */
export default function SectionJumpLink({
  targetId,
  className,
  children,
}: {
  /** 이동할 섹션의 id (# 없이) */
  targetId: string;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId);
    if (!target) return; // 섹션이 없으면 브라우저 기본 동작에 맡겨요
    e.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    // 주소창에도 #id 를 남겨, 새로고침하거나 공유해도 같은 위치로 와요
    window.history.replaceState(window.history.state, '', `#${targetId}`);
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
