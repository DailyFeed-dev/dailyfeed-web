/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationItem } from './NotificationTypes';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dailyfeed.accessToken');
  }
  return '';
};

export const notificationService = {
  fetchNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await fetch('/api/v1/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('알림 목록 조회 실패');
      const result = await response.json();

      return (result.data || []).map((item: any) => ({
        id: item.id.toString(),
        type: item.type === 'CHAT_MESSAGE' ? 'message' : 'post',
        title: item.title || item.actorName || '알림',
        message: item.body || '',
        time: new Intl.DateTimeFormat('ko-KR', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(item.createdAt)),
        linkUrl: item.type === 'CHAT_MESSAGE' ? `/chat?with=${item.actorId}` : item.linkPath || '#',
        avatarUrl:
          item.type === 'CHAT_MESSAGE' ? `https://i.pravatar.cc/150?u=${item.actorId}` : undefined,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // 👇 delete가 아닌 markAsRead 로 완전히 확정!
  markAsRead: async (id: string): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (!token) return false;

      const response = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const token = getAuthToken();
      if (!token) return 0;

      const response = await fetch('/api/v1/notifications/unread-count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return 0;
      const result = await response.json();

      let count = 0;
      if (typeof result.data === 'number') {
        count = result.data;
      } else if (result.data && typeof result.data.count === 'number') {
        count = result.data.count;
      } else if (result.data && typeof result.data.unreadCount === 'number') {
        count = result.data.unreadCount;
      } else {
        count = Number(result.data) || 0;
      }

      return isNaN(count) ? 0 : count;
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
};
