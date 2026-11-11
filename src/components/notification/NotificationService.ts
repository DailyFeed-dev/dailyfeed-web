/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationItem } from './NotificationTypes';

const BASE_URL = 'http://15.164.3.88:8080';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'post',
    title: '게시물 제목',
    boardName: '자유게시판',
    message: '내 게시물에 새로운 댓글이 달렸습니다.',
    time: '오후 8:00',
    linkUrl: '/board/1',
  },
  {
    id: '2',
    type: 'message',
    title: '김민지',
    message: '로그인 API 연결 끝났어요 🎉',
    time: '오전 9:00',
    avatarUrl: 'https://i.pravatar.cc/150?u=44',
    linkUrl: '/chat/123',
  },
];

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return '';
};

export const notificationService = {
  fetchNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const token = getAuthToken();

      if (!token) {
        console.log('🔒 로그인 토큰이 없어 임시(Mock) 데이터를 표시합니다.');
        if (typeof window !== 'undefined') {
          if (!(window as any).__MOCK_DATA__) {
            (window as any).__MOCK_DATA__ = [...INITIAL_NOTIFICATIONS];
          }
          return (window as any).__MOCK_DATA__;
        }
        return [];
      }

      const response = await fetch(`${BASE_URL}/api/v1/notifications`, {
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
        linkUrl: item.linkPath || '#',
        avatarUrl:
          item.type === 'CHAT_MESSAGE' ? `https://i.pravatar.cc/150?u=${item.actorId}` : undefined,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      const token = getAuthToken();

      if (!token) {
        if (typeof window !== 'undefined' && (window as any).__MOCK_DATA__) {
          (window as any).__MOCK_DATA__ = (window as any).__MOCK_DATA__.filter(
            (noti: NotificationItem) => noti.id !== id,
          );
        }
        return true;
      }

      const response = await fetch(`${BASE_URL}/api/v1/notifications/${id}/read`, {
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

      if (!token) {
        if (typeof window !== 'undefined' && (window as any).__MOCK_DATA__) {
          return (window as any).__MOCK_DATA__.length;
        }
        return INITIAL_NOTIFICATIONS.length;
      }

      const response = await fetch(`${BASE_URL}/api/v1/notifications/unread-count`, {
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
