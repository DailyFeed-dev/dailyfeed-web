import Link from 'next/link';

import NotificationBell from '@/features/notification/components/NotificationBell';
import ProfileMenu from '@/features/profile/components/ProfileMenu';

// 메뉴는 여기서 한 번에 관리합니다. 새 메뉴가 필요하면 팀에 공유한 뒤 수정하세요.
const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/til', label: 'TIL · 학습' },
  { href: '/archive', label: '자료실' },
  { href: '/chat', label: '채팅' },
];

export default function Header() {
  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold">
            DailyFeed
          </Link>
          <nav className="flex gap-4 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* 헤더 오른쪽 영역: 각 담당자가 자기 features 폴더의 컴포넌트만 수정합니다. */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
