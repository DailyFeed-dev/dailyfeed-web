import { NotificationItem } from './NotificationTypes'; // <-- 여기 경로가 수정되었습니다!

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'post',
    title: '게시물 제목',
    boardName: '게시판 목록',
    message: '게시물 내용',
    time: '오후 8:00',
    linkUrl: '/board/1',
  },
  {
    id: '2',
    type: 'post',
    title: '게시물 제목',
    boardName: '게시판 목록',
    message: '게시물 내용',
    time: '오전 9:00',
    linkUrl: '/board/2',
  },
  {
    id: '3',
    type: 'post',
    title: '게시물 제목',
    boardName: '게시판 목록',
    message: '게시물 내용',
    time: '어제',
    linkUrl: '/board/3',
  },
  {
    id: '4',
    type: 'message',
    title: '김민지',
    message: '로그인 API 연결 끝났어요 🎉',
    time: '11월01일',
    avatarUrl: 'https://i.pravatar.cc/150?img=44',
    linkUrl: '/chat/123',
  },
];

export const notificationService = {
  fetchNotifications: async (): Promise<NotificationItem[]> => {
    // API 연결 시: return fetch('/api/notifications').then(res => res.json());
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_NOTIFICATIONS), 200));
  },
  deleteNotification: async (id: string): Promise<boolean> => {
    // API 연결 시: await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    return new Promise((resolve) => setTimeout(() => resolve(true), 100));
  },
};
