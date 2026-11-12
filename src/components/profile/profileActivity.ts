import type { Schemas } from '@/lib/api';

export type ProfileView = 'overview' | 'information' | 'posts' | 'reflections';

export function getProfilePostBody(post: Schemas['PostResponse']) {
  // Swagger의 프로젝트 body와 달리 일반 게시판의 실제 응답은 content를 사용한다.
  if ('content' in post && typeof post.content === 'string') return post.content;
  return post.body ?? '';
}

export function formatProfileDate(value?: string) {
  if (!value) return '날짜 정보 없음';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '날짜 정보 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getProfileMonth(value?: string) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
  }).format(date);
}
