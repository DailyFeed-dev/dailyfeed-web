import type { ProfileActivity, ProfileRecord } from './profileActivity';
// api 연결하기 전까지 사용하는 샘플 데이터
const projects = [
  { id: 1, name: 'DailyFeed', description: '프론트엔드 개발' },
  { id: 2, name: '프론트엔드 스터디', description: '함께 공부하고 기록하는 공간' },
];

const titles = [
  '마이페이지 화면 구조를 정리했어요',
  'API 응답을 화면에 연결하는 방법',
  '이번 주 스터디 내용을 공유합니다',
  '반복되는 입력창을 컴포넌트로 나누기',
  '상태와 이벤트 처리 흐름 정리',
  '프로필 사진 미리보기 구현 기록',
  '화면 크기에 맞춰 카드 배치하기',
  'TypeScript의 타입을 읽는 방법',
  '오류 메시지와 입력창 연결하기',
  '공통 버튼 컴포넌트 사용하기',
  '서비스와 화면 코드를 구분하기',
  '프로젝트 첫 화면을 만들었습니다',
];

export const samplePosts: ProfileRecord[] = titles.map((title, index) => {
  const project = projects[index % 2];
  return {
    id: index + 1,
    projectId: project.id,
    projectName: project.name,
    title,
    body: `${title}\n\n이번 작업에서 확인한 내용을 정리했습니다. 화면, 입력값, 상태가 어떻게 이어지는지 살펴보고 다음 작업에 적용합니다.`,
    createdAt: `2026-11-${String(11 - Math.floor(index / 2)).padStart(2, '0')}T10:00:00+09:00`,
  };
});

const dailyCounts = new Map([
  ['2026-11-01', 1],
  ['2026-11-02', 2],
  ['2026-11-03', 1],
  ['2026-11-05', 2],
  ['2026-11-06', 1],
  ['2026-11-08', 3],
  ['2026-11-09', 1],
  ['2026-11-10', 2],
  ['2026-11-11', 1],
]);

export const sampleActivity: ProfileActivity = {
  month: '2026-11',
  postCount: samplePosts.length,
  projects,
  reflections: Array.from({ length: 8 }, (_, index) => ({
    id: index + 101,
    projectId: (index % 2) + 1,
    title: [
      '화면의 작은 간격이 만드는 차이',
      'API를 기준으로 화면을 설계하기',
      '혼자보다 함께 배울 때',
    ][index % 3],
    body: '오늘 배운 내용과 어려웠던 점을 기록합니다.\n\n다음에는 문제를 더 작은 단계로 나눠 직접 확인하며 진행하겠습니다.',
    createdAt: `2026-11-${String(10 - index).padStart(2, '0')}T18:00:00+09:00`,
    kind: ['DAILY', 'WEEKLY', 'TEAM'][index % 3],
  })),
  tilStats: {
    totalTilCount: 14,
    consecutiveWritingDays: 4,
    thisWeekWriteCount: 4,
    last13WeeksDailyWriteCounts: Array.from({ length: 91 }, (_, index) => {
      const date = new Date(Date.UTC(2026, 10, 11 - (90 - index))).toISOString().slice(0, 10);
      return { date, count: dailyCounts.get(date) ?? 0 };
    }),
  },
};
