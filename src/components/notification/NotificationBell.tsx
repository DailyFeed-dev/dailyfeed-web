'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon } from '@/components/common/icons';
import { notificationService } from './NotificationService';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const data = await notificationService.fetchNotifications();
      setUnreadCount(data.length);
    };

    // 1. 처음 마운트될 때 개수 불러오기
    loadUnreadCount();

    // 2. 방송(이벤트)을 수신했을 때 실행될 함수
    const handleUpdate = () => {
      loadUnreadCount();
    };

    window.addEventListener('notification-updated', handleUpdate);

    return () => {
      window.removeEventListener('notification-updated', handleUpdate);
    };
  }, []);

  const hasUnread = unreadCount > 0;

  return (
    <>
      <BellIcon className="size-5.5" />
      {hasUnread && (
        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-600 ring-2 ring-white" />
      )}
    </>
  );
}
