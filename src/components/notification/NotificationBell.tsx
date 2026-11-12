'use client';

import { useState, useEffect } from 'react';
import { notificationService } from './NotificationService';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 빨간 점 숫자를 가져오는 함수
    const fetchCount = async () => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;
      if (token && token !== 'null' && token !== 'undefined' && token !== '') {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      }
    };

    fetchCount();

    // 알림을 지웠을 때 빨간 점 실시간 동기화
    window.addEventListener('notification-updated', fetchCount);
    return () => window.removeEventListener('notification-updated', fetchCount);
  }, []);

  // 🔔 종 아이콘 클릭 핸들러
  const handleBellClick = (e: React.MouseEvent) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;

    // 🚨 비로그인 상태일 때만! 페이지 이동을 꽉 막고 팝업을 띄웁니다.
    if (!token || token === 'null' || token === 'undefined' || token === '') {
      e.preventDefault();
      e.stopPropagation();
      alert('로그인이 필요합니다.');
      return;
    }

    // ✅ 로그인 상태일 때는 막지 않고 통과시켜서 정상적으로 알림창으로 넘어가게 합니다.
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        aria-label="알림"
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-zinc-100"
      >
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

        {/* 미읽음 빨간 점(뱃지): 숫자가 1 이상일 때만 표시 */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          </span>
        )}
      </button>
    </div>
  );
}
