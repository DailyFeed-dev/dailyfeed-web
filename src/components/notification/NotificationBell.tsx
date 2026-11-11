/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notificationService } from './NotificationService';

export default function NotificationBell() {
  const [hasNew, setHasNew] = useState(false);

  const fetchBadgeStatus = async () => {
    const unreadCount = await notificationService.getUnreadCount();
    setHasNew(unreadCount > 0);
  };

  useEffect(() => {
    fetchBadgeStatus();
    window.addEventListener('notification-updated', fetchBadgeStatus);

    return () => {
      window.removeEventListener('notification-updated', fetchBadgeStatus);
    };
  }, []);

  return (
    <Link href="/notifications" className="relative inline-flex items-center justify-center p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700 transition-colors hover:text-black"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>

      {hasNew && (
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </span>
      )}
    </Link>
  );
}
