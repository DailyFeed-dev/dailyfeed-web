// 온보딩 맨 아래 한 줄 소개
export default function OnboardingFooter() {
  return (
    <footer className="-mx-4 flex flex-col gap-2 border-t border-[#ECEAF4] px-4 py-8 sm:-mx-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:-mx-20 lg:px-20">
      <p className="text-[13px] leading-[1.55] text-[#6C6980]">
        Daily Feed · 매일 조금씩, 함께 기록하고 성장하는 개발 커뮤니티
      </p>
      <p className="font-mono text-[12px] leading-[1.5] text-[#A9A8B6]">
        v0.1.0 · built with Next.js
      </p>
    </footer>
  );
}
