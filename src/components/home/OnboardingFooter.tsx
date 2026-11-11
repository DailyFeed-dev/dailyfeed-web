import { fullBleedBackground } from './fullBleed';

// 온보딩 맨 아래 한 줄 소개 (위쪽 구분선은 화면 양끝까지)
export default function OnboardingFooter() {
  return (
    <footer
      className="flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between"
      style={fullBleedBackground(
        'linear-gradient(to bottom, var(--color-border-default) 1px, transparent 1px)',
      )}
    >
      <p className="text-[13px] leading-[1.55] text-(--color-text-muted)">
        Daily Feed · 매일 조금씩, 함께 기록하고 성장하는 개발 커뮤니티
      </p>
      <p className="font-mono text-[12px] leading-[1.5] text-(--color-text-disabled)">
        v0.1.0 · built with Next.js
      </p>
    </footer>
  );
}
