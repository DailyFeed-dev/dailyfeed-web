import type { Schemas } from '@/lib/api';

export type ProfileView = 'overview' | 'information' | 'posts' | 'reflections';

export const reflectionLabels: Record<string, string> = {
  DAILY: '일간 회고',
  WEEKLY: '주간 회고',
  ASSIGNMENT: '과제 회고',
  TEAM: '팀 회고',
};

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

export function getProfileProjectName(projects: Schemas['ProjectResponse'][], id?: number) {
  if (id === undefined) return '프로젝트 정보 없음';

  return projects.find((project) => project.id === id)?.name ?? `프로젝트 ${id}`;
}
