'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // 💡 next/image 컴포넌트 임포트
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

      // 💡 try-catch-finally를 통해 통신 실패 시에도 무한 로딩 멈춤 방어
      try {
        const data = await notificationService.fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('알림 목록 로딩 에러:', error);
        // 필요 시 여기서 UI(예: Toast)로 에러 표출 가능
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [router]);

  // 💡 즉각 차감(Optimistic)을 위해 이벤트에 DECREMENT 액션 추가
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

    // 상태 백업 (롤백용)
    const previousNotifications = [...notifications];

    // UI 즉각 반영 (Fire-and-forget)
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    triggerDecrementEvent();

    // 백그라운드 API 호출
    notificationService.markAsRead(id).then((isSuccess) => {
      if (!isSuccess) {
        // 💡 통신 실패 시 UI 롤백 처리
        setNotifications(previousNotifications);
        triggerIncrementEvent();
        alert('알림 삭제에 실패했습니다.');
      }
    });
  };

  // 💡 async await 제거로 체감속도 극한상승 (Fire-and-forget)
  const handleNotificationClick = (noti: NotificationItem) => {
    const previousNotifications = [...notifications];

    // 1. UI 목록에서 즉시 제거 & 벨 숫자 즉시 차감
    setNotifications((prev) => prev.filter((item) => item.id !== noti.id));
    triggerDecrementEvent();

    // 2. 서버 통신 기다리지 않고 페이지 쾌속 이동!
    if (noti.linkUrl) router.push(noti.linkUrl);

    // 3. 백그라운드에서 읽음 처리 (실패 시 롤백)
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
                    {/* 💡 일반 img 대신 next/image 최적화 컴포넌트 사용 */}
                    {noti.avatarUrl && (
                      <Image
                        src={noti.avatarUrl}
                        alt="프로필"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    )}
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
