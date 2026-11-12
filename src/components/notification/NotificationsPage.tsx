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
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;

    // 팝업을 띄우지 않고, 비로그인 상태로 주소창에 직접 쳐서 들어온 경우에만 안전하게 뒤로 보냄
    if (!token) {
      router.back();
      return;
    }

    notificationService.fetchNotifications().then((data) => {
      setNotifications(data);
      setIsLoading(false);
    });
  }, [router]);

  const triggerUpdateEvent = () => {
    window.dispatchEvent(new CustomEvent('notification-updated'));
  };

  const handleDeleteOnly = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    await notificationService.deleteNotification(id);
    triggerUpdateEvent();
  };

  const handleNotificationClick = async (noti: NotificationItem) => {
    setNotifications((prev) => prev.filter((item) => item.id !== noti.id));
    await notificationService.deleteNotification(noti.id);
    triggerUpdateEvent();
    if (noti.linkUrl) router.push(noti.linkUrl);
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

              <div className="flex items-center gap-4">
                {noti.type === 'post' ? (
                  <div className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-[12px] bg-[#EEF2FF] text-[#6366F1]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" />
                    </svg>
                  </div>
                ) : (
                  <div className="relative h-[48px] w-[48px] flex-shrink-0">
                    <img
                      src={noti.avatarUrl}
                      alt="프로필"
                      className="h-full w-full rounded-full object-cover"
                    />
                    <div className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-[#10B981]"></div>
                  </div>
                )}
                <p className="flex-1 text-[15px] font-medium text-gray-800">{noti.message}</p>
                <span className="text-[13px] font-medium text-gray-400">{noti.time}</span>
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
