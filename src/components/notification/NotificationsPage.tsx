'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationItem } from './NotificationTypes';
import { notificationService } from './NotificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;

      if (!token || token === 'null' || token === 'undefined' || token === '') {
        router.replace('/login');
        return;
      }

      try {
        const data = await notificationService.fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('알림 목록 로딩 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router]);

  const triggerDecrementEvent = () => {
    window.dispatchEvent(
      new CustomEvent('notification-updated', { detail: { type: 'DECREMENT' } }),
    );
  };

  const triggerIncrementEvent = () => {
    window.dispatchEvent(
      new CustomEvent('notification-updated', { detail: { type: 'INCREMENT' } }),
    );
  };

  const handleDeleteOnly = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const previousNotifications = [...notifications];

    setNotifications((prev) => prev.filter((item) => item.id !== id));
    triggerDecrementEvent();

    notificationService.markAsRead(id).then((isSuccess) => {
      if (!isSuccess) {
        setNotifications(previousNotifications);
        triggerIncrementEvent();
        alert('알림 삭제에 실패했습니다.');
      }
    });
  };

  const handleNotificationClick = (noti: NotificationItem) => {
    const previousNotifications = [...notifications];

    setNotifications((prev) => prev.filter((item) => item.id !== noti.id));
    triggerDecrementEvent();

    if (noti.linkUrl) router.push(noti.linkUrl);

    notificationService.markAsRead(noti.id).then((isSuccess) => {
      if (!isSuccess) {
        setNotifications(previousNotifications);
        triggerIncrementEvent();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7FB] p-8 text-gray-400 md:p-12">
        알림을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FB] p-8 md:p-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-[24px] font-bold text-gray-900">새 소식</h1>

        <div className="flex flex-col gap-6">
          {notifications.map((noti) => (
            <div
              key={noti.id}
              onClick={() => handleNotificationClick(noti)}
              className="flex cursor-pointer flex-col gap-5 rounded-[16px] border border-gray-50 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">{noti.title}</h2>
                  {noti.boardName && (
                    <p className="mt-1 text-[13px] text-gray-400">{noti.boardName}</p>
                  )}
                </div>
                <button
                  onClick={(e) => handleDeleteOnly(noti.id, e)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3F4F6] text-gray-400 transition-colors hover:bg-[#EEF2FF] hover:text-[#6366F1]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="flex-1 text-[15px] font-medium text-gray-800">{noti.message}</p>
                <span className="text-[13px] font-medium whitespace-nowrap text-gray-400">
                  {noti.time}
                </span>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-gray-50 bg-white py-20 text-center shadow-sm">
              <span className="mb-4 text-4xl">📭</span>
              <p className="font-medium text-gray-400">새로운 소식이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
