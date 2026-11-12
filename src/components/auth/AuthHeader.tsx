import Link from 'next/link';

// Auth 화면 상단 헤더입니다. (메인 화면의 components/layout/Header 와는 별개)
export default function AuthHeader() {
  return (
    <header className="flex h-[100px] shrink-0 items-center justify-between gap-4 bg-white px-5 lg:px-[50px] xl:pr-[95px]">
      <Link href="/" className="text-2xl font-semibold whitespace-nowrap">
        DailyFeed
      </Link>
      <Link
        href="/"
        className="flex items-center gap-2 text-[15px] font-medium whitespace-nowrap text-[#706d81] hover:text-(--color-text-primary)"
      >
        메인으로 돌아가기
        <span aria-hidden="true">→</span>
      </Link>
    </header>
  );
}
