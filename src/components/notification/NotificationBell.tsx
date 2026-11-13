'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notificationService } from './NotificationService';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter(); // 💡 라우팅을 위한 useRouter 추가

  useEffect(() => {
    const fetchCount = async () => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;
      if (token && token !== 'null' && token !== 'undefined' && token !== '') {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      }
    };

    fetchCount();

    // 💡 이벤트 페이로드를 받아 낙관적 업데이트(즉시 -1) 처리
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type === 'DECREMENT') {
        // 서버 요청 없이 프론트 단에서 즉시 -1 (0 밑으로는 안 내려가게 방어)
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else if (customEvent.detail?.type === 'INCREMENT') {
        setUnreadCount((prev) => prev + 1); // 롤백용
      } else {
        fetchCount(); // 전체 갱신이 필요할 땐 백엔드 요청
      }
    };

    window.addEventListener('notification-updated', handleUpdate);
    return () => window.removeEventListener('notification-updated', handleUpdate);
  }, []);

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token =
      typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;

    if (!token || token === 'null' || token === 'undefined' || token === '') {
      alert('로그인이 필요합니다.');
      return;
    }

    // 💡 팝업 띄우는 로직 제거하고 곧바로 알림 페이지로 이동!
    router.push('/notifications');
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
