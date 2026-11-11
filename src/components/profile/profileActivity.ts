export type ProfileView = 'overview' | 'information' | 'posts' | 'reflections' | 'settings';

export type ProfileProject = { id: number; name: string; description: string };
export type ProfileRecord = {
  id: number;
  projectId?: number;
  projectName?: string;
  title: string;
  body: string;
  createdAt: string;
};
export type ProfileReflection = ProfileRecord & { kind: string };
export type ProfilePostPage = {
  items: ProfileRecord[];
  page: number;
  size: number;
  totalElements: number;
};
export type ProfileDailyCount = { date: string; count: number };
export type ProfileTilStats = {
  totalTilCount: number;
  consecutiveWritingDays: number;
  thisWeekWriteCount: number;
  last13WeeksDailyWriteCounts: ProfileDailyCount[];
};
export type ProfileActivity = {
  month: string;
  postCount: number;
  projects: ProfileProject[];
  reflections: ProfileReflection[];
  tilStats: ProfileTilStats;
};

export const reflectionLabels: Record<string, string> = {
  DAILY: '일간 회고',
  WEEKLY: '주간 회고',
  ASSIGNMENT: '과제 회고',
  TEAM: '팀 회고',
};

export function formatProfileDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '날짜 정보 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getProfileMonth(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
  }).format(date);
}

export function getProfileProjectName(projects: ProfileProject[], id?: number) {
  return (
    projects.find((project) => project.id === id)?.name ??
    (id === undefined ? '프로젝트 정보 없음' : `프로젝트 ${id}`)
  );
}
