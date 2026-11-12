/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationItem } from './NotificationTypes';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // ✅ 1. 팀원이 정해둔 정확한 토큰 이름표(dailyfeed.accessToken)로 꺼내옵니다.
    return localStorage.getItem('dailyfeed.accessToken');
  }
  return '';
};

export const notificationService = {
  // 1. 알림 목록 불러오기
  fetchNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const token = getAuthToken();
      if (!token) return [];

      // ✅ 2. BASE_URL을 빼고 프록시 설정에 맞게 상대 경로(/api/...)로 직접 찌릅니다.
      const response = await fetch('/api/v1/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('알림 목록 조회 실패');
      const result = await response.json();

      return result.data.map((item: any) => ({
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

  // 2. 알림 삭제(읽음) 처리
  deleteNotification: async (id: string): Promise<boolean> => {
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

  // 3. 미읽음 알림 개수 조회 (헤더 뱃지용)
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
      return typeof result.data === 'number' ? result.data : Number(result.data || 0);
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
};
