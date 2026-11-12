'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { UserIcon } from '@/components/common/icons';
import Modal from '@/components/common/Modal';
import SubMenu from '@/components/common/SubMenu';
import type { Schemas } from '@/lib/api';
import { logout } from '@/services/authService';
import { getMyProfile } from '@/services/profileService';

type Me = Pick<Schemas['AuthResponse'], 'name' | 'avatarUrl'>;

/**
 * 헤더 오른쪽 프로필 사진 (로그인했을 때만 보여요)
 * - 내 정보(getMyProfile, 프로필 담당 API)의 avatarUrl 을 보여 줘요.
 * - 사진이 없거나 못 불러오면 닉네임 첫 글자, 불러오는 중이면 기본 사람 아이콘이에요.
 */
function ProfilePhoto() {
  const [me, setMe] = useState<Me | null>(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getMyProfile(controller.signal)
      .then((profile) => setMe({ name: profile.name, avatarUrl: profile.avatarUrl }))
      .catch(() => {
        // 불러오지 못해도 헤더는 그대로 써야 해서 기본 아이콘을 그대로 둬요.
      });
    return () => controller.abort();
  }, []);

  if (me?.avatarUrl && !photoFailed) {
    return (
      <Image
        src={me.avatarUrl}
        alt=""
        width={40}
        height={40}
        unoptimized
        onError={() => setPhotoFailed(true)}
        className="size-10 rounded-full object-cover"
      />
    );
  }
  if (me?.name?.trim()) {
    return <span className="text-[15px] font-semibold">{me.name.trim().slice(0, 1)}</span>;
  }
  return <UserIcon className="size-5" />;
}

/** 헤더 오른쪽 프로필 사진 버튼. 누르면 서브 메뉴(프로필 보기 / 로그아웃)가 열립니다. */
export default function HeaderProfileDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
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
        className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 transition-[background-color,box-shadow] hover:bg-indigo-200 hover:ring-2 hover:ring-indigo-200"
      >
        <ProfilePhoto />
      </button>
      {open && (
        <SubMenu
          className="absolute top-full right-0 mt-2 min-w-36"
          items={[
            { label: '프로필 보기', href: '/profile', onClick: close },
            {
              label: '로그아웃',
              tone: 'danger',
              onClick: () => {
                close();
                setLogoutOpen(true);
              },
            },
          ]}
        />
      )}
      <Modal
        open={logoutOpen}
        title="로그아웃 하시겠어요?"
        body={'로그아웃하면 로그인 화면으로 이동합니다.\n진행하기 전에 다시 한번 확인해 주세요.'}
        confirmLabel="로그아웃"
        cancelLabel="취소"
        onCancel={() => setLogoutOpen(false)}
        // 서버 로그아웃 + 브라우저 토큰 삭제 후 로그인 화면으로 (뒤로 가기로 돌아오지 않게 replace)
        // logout() 은 서버 요청이 실패해도 토큰은 지우고 오류를 던지지 않아요. (services/authService)
        onConfirm={async () => {
          setLogoutOpen(false);
          await logout();
          router.replace('/login');
        }}
      />
    </div>
  );
}
