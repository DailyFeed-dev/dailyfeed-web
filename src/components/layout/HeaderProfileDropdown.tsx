'use client';

import { useEffect, useRef, useState } from 'react';

import { UserIcon } from '@/components/common/icons';
import SubMenu from '@/components/common/SubMenu';

/** 헤더 오른쪽 프로필 버튼. 누르면 서브 메뉴(프로필 보기 / 로그아웃)가 열립니다. */
export default function HeaderProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="프로필"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200"
      >
        <UserIcon className="size-5" />
      </button>
      {open && (
        <SubMenu
          className="absolute top-full right-0 mt-2 min-w-36"
          items={[
            { label: '프로필 보기', href: '/profile', onClick: close },
            { label: '로그아웃', tone: 'danger', href: '/logout', onClick: close },
          ]}
        />
      )}
    </div>
  );
}
