import type { ReactNode } from 'react';

/**
 * 맥 터미널처럼 생긴 검은 창 틀 (히어로 코드 창 · 3단계 섹션에서 같이 씀)
 * 배경 gray/900 · 위쪽 바 gray/800 · radius/xl(16)
 * 창 버튼 점 3개는 팀 색 변수(danger · accent · success)를 씁니다.
 */
export default function TerminalWindow({
  title,
  className = '',
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-[#1F1D2B] ${className}`}>
      <div className="flex h-12 items-center gap-2 bg-[#2E2D3A] px-5">
        <span className="size-3 rounded-full bg-[#D41717]" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#E8D156]" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#22C55E]" aria-hidden="true" />
        <span className="ml-3 font-mono text-[12px] leading-[1.5] text-(--color-text-disabled)">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
