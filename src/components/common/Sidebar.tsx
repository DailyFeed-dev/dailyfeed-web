'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';

import {
  ArchiveIcon,
  BellIcon,
  BookOpenIcon,
  HomeIcon,
  LogOutIcon,
  MessageCircleIcon,
  UserIcon,
} from '@/components/common/icons';

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

// 메뉴는 여기서 한 번에 관리합니다. 새 메뉴가 필요하면 팀에 공유한 뒤 수정하세요.
const MENU_ITEMS: NavItem[] = [
  { href: '/', label: '홈', icon: HomeIcon },
  { href: '/til', label: 'TIL · 학습', icon: BookOpenIcon },
  { href: '/archive', label: '자료실', icon: ArchiveIcon },
  { href: '/chat', label: '채팅', icon: MessageCircleIcon },
];

const OTHER_ITEMS: NavItem[] = [
  { href: '/notifications', label: '알림', icon: BellIcon },
  { href: '/profile', label: '프로필', icon: UserIcon },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-1">
      <p className="px-4 pb-2 text-sm font-bold text-zinc-900">{title}</p>
      {items.map(({ href, label, icon: ItemIcon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex h-13 items-center gap-3 rounded-lg px-4 font-medium transition-colors ${
              active ? 'bg-zinc-950 text-white' : 'text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <ItemIcon className="size-5.5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto bg-white px-5 lg:flex">
      <div className="flex h-25 shrink-0 items-center border-b border-zinc-200">
        <Link href="/" className="text-xl font-bold text-zinc-950">
          DailyFeed
        </Link>
      </div>

      <nav aria-label="주 메뉴" className="flex flex-col gap-8 py-6">
        <NavSection title="MENU" items={MENU_ITEMS} />
        <div className="flex flex-col gap-1">
          <NavSection title="OTHER" items={OTHER_ITEMS} />
          {/* 로그인 기능이 생기면 실제 로그아웃 처리로 바꿉니다. */}
          <Link
            href="/login"
            className="flex h-13 items-center gap-3 rounded-lg px-4 font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOutIcon className="size-5.5 shrink-0" />
            로그아웃
          </Link>
        </div>
      </nav>
    </aside>
  );
}
