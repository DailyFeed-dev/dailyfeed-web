export interface NotificationItem {
  id: string;
  type: 'post' | 'message';
  title: string;
  boardName?: string;
  message: string;
  time: string;
  avatarUrl?: string;
  linkUrl?: string;
}
