import type { CSSProperties, ReactNode } from 'react';

import AuthHeader from '@/components/auth/AuthHeader';
import AuthIntroPanel from '@/components/auth/AuthIntroPanel';

/**
 * Auth 화면 색상입니다. 이 컴포넌트 안에서만 쓰이고, 하위 컴포넌트는 bg-(--auth-primary) 처럼 사용합니다.
 * 주석은 대응하는 팀 디자인 시스템 토큰입니다. 전역 토큰이 생기면 이 값만 바꾸면 됩니다.
 */
const AUTH_COLORS = {
  '--auth-primary': '#6157e9', // brand/500 (bg/brand, border/brand)
  '--auth-text-primary': '#1f1d2b', // text/primary (gray/900)
  '--auth-border-default': '#eceaf4', // border/default (gray/200)
  '--auth-border-strong': '#dfdde8', // border/strong (gray/300)
  '--auth-danger': '#d41717', // text/danger, border/danger (red/500)
  '--auth-danger-soft': '#fdecec', // bg/danger-soft (red/50)
  '--auth-page-bg': '#f6f5fb', // bg/page (gray/50)
} as CSSProperties;

/**
 * Auth 화면 공통 틀: 헤더 + [소개 패널 | 페이지 카드] 2단 + 카드 아래 저작권 표시.
 * 1024px 미만에서는 소개 패널을 숨기고 카드만 가운데에 둡니다.
 */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={AUTH_COLORS}
      className="flex flex-1 flex-col bg-(--auth-page-bg) text-(--auth-text-primary)"
    >
      <AuthHeader />
      <main className="mx-auto flex w-full max-w-[1262px] flex-1 justify-center gap-[88px] px-5 pt-8 pb-10 lg:pt-[50px] lg:pb-[90px]">
        <AuthIntroPanel />
        <div className="flex w-full max-w-[540px] min-w-0 flex-col lg:w-[540px] lg:shrink-0 lg:pt-[23px]">
          {children}
          <p className="mt-10 text-center text-[13px] text-[#a8a6b6] lg:mt-[81px]">© DailyFeed</p>
        </div>
      </main>
    </div>
  );
}
