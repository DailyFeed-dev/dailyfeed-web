import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon } from '@/components/common/icons';
import { notificationService } from './NotificationService';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 컴포넌트 스스로 서버(Mock)에서 알림 개수를 가져옵니다.
    notificationService.fetchNotifications().then((data) => {
      setUnreadCount(data.length);
    });
  }, []);

  const hasUnread = unreadCount > 0;

  return (
    <Link
      href="/notifications"
      aria-label="알림"
      className="relative flex size-10 items-center justify-center rounded-full text-zinc-900 transition-colors hover:bg-zinc-100"
    >
      <BellIcon className="size-5.5" />
      {hasUnread && (
        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-600 ring-2 ring-white" />
      )}
    </Link>
  );
}
