import Link from 'next/link';

import { SearchIcon } from '@/components/common/icons';
import NotificationBell from '@/components/notification/NotificationBell';
import ProfileMenu from '@/components/profile/ProfileMenu';

// 메뉴는 Sidebar.tsx 에서 관리합니다.
export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-25 shrink-0 items-center justify-between gap-4 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-6">
        {/* 사이드바가 숨겨지는 작은 화면에서만 로고를 보여줍니다. */}
        <Link href="/" className="text-xl font-bold text-zinc-950 lg:hidden">
          DailyFeed
        </Link>
        {/* 검색 기능이 생기면 이 입력창을 연결합니다. */}
        <label className="hidden h-12 w-90 items-center gap-3 rounded-lg bg-zinc-100 px-4 text-zinc-500 focus-within:ring-2 focus-within:ring-zinc-300 md:flex">
          <SearchIcon className="size-5 shrink-0" />
          <input
            type="search"
            placeholder="검색..."
            aria-label="검색"
            className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500"
          />
        </label>
      </div>

      {/* 헤더 오른쪽 영역: 각 담당자가 자기 components/<도메인> 폴더의 컴포넌트만 수정합니다. */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  );
}
