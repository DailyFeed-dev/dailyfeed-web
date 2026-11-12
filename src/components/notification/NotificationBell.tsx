'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notificationService } from './NotificationService';
// (참고: 유저님이 쓰시던 아이콘이나 팝오버 컴포넌트 임포트 경로가 있다면 유지해주세요)

export default function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 미읽음 개수 가져오기 (로그인 상태일 때만)
  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;
    if (token) {
      notificationService
        .getUnreadCount()
        .then(setUnreadCount)
        .catch(() => setUnreadCount(0));
    }
  }, []);

  // 🔔 종 아이콘 클릭 핸들러
  const handleBellClick = () => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;

    // 토큰이 없으면 로그인 페이지로 이동
    if (!token) {
      router.push('/login');
      return;
    }

    // 토큰이 있으면 알림 팝오버 열기/닫기 토글
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* 🚀 유저님이 원래 쓰시던 벨 버튼 UI & SVG & 빨간 뱃지 코드 */}
      <button
        onClick={handleBellClick}
        aria-label="알림"
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-zinc-100"
      >
        {/* 종 아이콘 SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5.5 text-zinc-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        {/* 미읽음 빨간 점(뱃지) */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
          </span>
        )}
      </button>

      {/* (참고) isOpen이 true일 때 나타나는 알림 목록 팝오버 컴포넌트가 있다면 여기에 배치하시면 됩니다. */}
    </div>
  );
}
