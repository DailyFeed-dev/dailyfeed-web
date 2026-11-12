import type { CSSProperties, ReactNode } from 'react';

import AuthHeader from '@/components/auth/AuthHeader';
import AuthIntroPanel from '@/components/auth/AuthIntroPanel';

/**
 * Auth 화면 전용 색상입니다. 공통 색상은 globals.css 의 --color-* 를 쓰고,
 * 아직 공통 변수에 없는 값만 여기에 둡니다. 공통 변수가 생기면 지우고 그것으로 바꿉니다.
 */
const AUTH_COLORS = {
  '--auth-page-bg': '#f6f5fb', // 디자인 시스템 bg/page (gray/50), globals.css 에 아직 없음
} as CSSProperties;

/**
 * Auth 화면 공통 틀: 헤더 + [소개 패널 | 페이지 카드] 2단 + 카드 아래 저작권 표시.
 * 1024px 미만에서는 소개 패널을 숨기고 카드만 가운데에 둡니다.
 */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={AUTH_COLORS}
      className="flex flex-1 flex-col bg-(--auth-page-bg) text-(--color-text-primary)"
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
