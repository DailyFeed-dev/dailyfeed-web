'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MessageCircleIcon } from '@/components/common/icons';
import NotificationBell from '@/components/notification/NotificationBell';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';

import HeaderLoginLink from './HeaderLoginLink';
import HeaderProfileDropdown from './HeaderProfileDropdown';

// 메뉴는 여기서 한 번에 관리합니다. 새 메뉴가 필요하면 팀에 공유한 뒤 수정하세요.
const NAV_ITEMS = [
  { label: '게시판', href: '/board' },
  { label: 'TIL', href: '/til' },
  { label: 'FAQ', href: '/faq' },
];

const iconButtonClass =
  'flex size-10 items-center justify-center rounded-full text-zinc-900 transition-colors hover:bg-zinc-100';

export default function Header() {
  const pathname = usePathname();
  const isLoggedIn = useIsLoggedIn();

  return (
    <header className="sticky top-0 z-10 flex h-25 shrink-0 items-center justify-between bg-white px-4 sm:px-10">
      <div className="flex items-center gap-8 md:gap-16">
        <Link href="/" className="text-2xl font-bold text-zinc-950">
          DailyFeed
        </Link>
        <nav aria-label="주 메뉴" className="hidden items-center gap-8 text-lg font-medium sm:flex">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'font-semibold text-indigo-600 underline decoration-2 underline-offset-4'
                    : 'text-zinc-900 hover:text-indigo-600'
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 헤더 오른쪽 영역: 각 담당자가 자기 components/<도메인> 폴더의 컴포넌트만 수정합니다.
          [알림 · 채팅]  |  로그인 전: [로그인/회원가입] / 로그인 후: [프로필 사진] */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1">
          <Link
            href="/notifications"
            aria-label="알림"
            className="relative flex size-10 items-center justify-center rounded-full text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            <NotificationBell />
          </Link>
          <Link href="/chat" aria-label="채팅" className={iconButtonClass}>
            <MessageCircleIcon className="size-5.5" />
          </Link>
        </div>
        {/* 아이콘과 계정 영역을 나누는 얇은 세로선 */}
        <span aria-hidden="true" className="hidden h-6 w-px bg-zinc-200 sm:block" />
        {/* 로그인 여부를 아직 모를 때(첫 화면)는 같은 크기의 빈자리만 두어 깜빡임 · 흔들림을 막아요 */}
        {isLoggedIn === null && <span aria-hidden="true" className="size-10" />}
        {isLoggedIn === false && <HeaderLoginLink />}
        {isLoggedIn === true && <HeaderProfileDropdown />}
      </div>
    </header>
  );
}
