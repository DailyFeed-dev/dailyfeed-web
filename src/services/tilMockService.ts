import { ApiError, type Schemas } from '@/lib/api';
import type { TilListQuery } from '@/types/til';

/**
 * 테스트용 가짜 TIL API 입니다. (tilService.ts 의 USE_TIL_MOCK = true 일 때만 사용)
 * 데이터는 메모리에만 있어서 새로고침하면 처음 상태로 돌아갑니다.
 * TODO: 백엔드로 테스트할 수 있게 되면 이 파일을 지웁니다.
 */

// 가짜 데이터는 값을 모두 채워 두고(계산하기 쉽게), 돌려줄 때는 Schemas 타입으로 내보냅니다.
type Filled<T> = { [K in keyof T]-?: Exclude<T[K], undefined> };
type MockUser = Schemas['AuthorResponse'] & { id: number; name: string };
type MockTil = Filled<Omit<Schemas['TilResponse'], 'author'>> & { author: MockUser };
type MockComment = Filled<Omit<Schemas['CommentResponse'], 'author'>> & { author: MockUser };

const DELAY_MS = 300;
const wait = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), DELAY_MS));

// ---- 사용자 ----

/** 로그인한 나 (id 1) — 내 글에는 수정/삭제, 내 댓글에는 삭제 메뉴가 보입니다. */
const ME: MockUser = { id: 1, name: '테스트 사용자' };
const USERS: MockUser[] = [
  ME,
  { id: 2, name: '김민지' },
  { id: 3, name: '이준호' },
  { id: 4, name: '박서연' },
  { id: 5, name: '최도윤' },
];

// ---- 글 ----

const now = Date.now();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const isoAgo = (ms: number) => new Date(now - ms).toISOString();

const SAMPLE_BODY = `## 오늘 배운 것

Next.js App Router 에서 **서버 컴포넌트**와 _클라이언트 컴포넌트_의 경계를 정리했다.
자세한 내용은 [공식 문서](https://nextjs.org/docs)를 참고.

- 서버 컴포넌트는 기본값
- \`'use client'\` 를 붙이면 클라이언트 컴포넌트
  - 이벤트 핸들러, 훅은 클라이언트에서만

### 체크리스트

- [x] 공식 문서 읽기
- [x] 예제 따라 하기
- [ ] 팀 코드에 적용하기

> 경계는 가능한 한 아래쪽(잎사귀)에 두는 게 좋다.

\`\`\`tsx
// app/page.tsx
export default async function Page() {
  const data = await getData();
  return <List items={data} />;
}
\`\`\`

| 구분 | 서버 | 클라이언트 |
| --- | --- | --- |
| 데이터 패칭 | O | △ |
| useState | X | O |

---

~~어제는 헷갈렸는데~~ 이제 조금 알 것 같다.`;

const TOPICS = [
  'React 19 의 use 훅 정리',
  'Tailwind v4 에서 바뀐 점',
  'TypeScript satisfies 연산자',
  'useSyncExternalStore 로 localStorage 구독하기',
  'Git rebase 와 merge 차이',
  'HTTP 캐시 헤더 정리',
  'CSS field-sizing 속성',
  'Next.js 프록시(rewrites) 설정',
  'ESLint flat config 옮기기',
  '접근성: aria-pressed 와 aria-checked',
  '자바스크립트 이벤트 루프',
  'Docker 멀티 스테이지 빌드',
  'SQL 인덱스가 안 타는 경우',
  '아주 긴 제목이 카드와 상세 화면에서 어떻게 줄바꿈되는지 확인하기 위한 테스트용 TIL 제목입니다',
];

let tils: MockTil[] = TOPICS.map((title, i) => {
  const id = TOPICS.length - i;
  const createdAt = isoAgo(i * DAY + 2 * HOUR);
  return {
    id,
    title,
    body: i === 0 ? SAMPLE_BODY : `${title} 에 대해 공부한 내용입니다.\n\n${SAMPLE_BODY}`,
    author: USERS[i % USERS.length],
    createdAt,
    // 3번째 글마다 '수정됨' 표시가 보이도록
    updatedAt: i % 3 === 0 ? isoAgo(i * DAY) : createdAt,
    likeCount: (i * 7) % 23,
    commentCount: 0,
    bookmarkCount: (i * 3) % 9,
    likedByMe: i % 4 === 1,
    bookmarkedByMe: i % 5 === 2,
  };
});

// ---- 댓글 ----

let nextCommentId = 1;
let comments: MockComment[] = tils.slice(0, 3).flatMap((til, t) =>
  [
    '정리 잘 봤어요! 많이 배웠습니다.',
    '두 번째 예제는 어떤 버전에서 확인하셨나요?',
    '저도 같은 문제로 헤맸는데 덕분에 해결했어요.\n줄바꿈도 잘 보이나요?',
    '좋은 글 감사합니다 🙌',
    '내가 쓴 댓글이에요. ⋯ 메뉴로 삭제해 보세요.',
  ]
    .slice(0, 5 - t)
    .map((content, c) => ({
      id: nextCommentId++,
      postId: til.id,
      content,
      author: content.startsWith('내가') ? ME : USERS[(c + 1) % USERS.length],
      createdAt: isoAgo((c + 1) * 3 * HOUR),
      likeCount: (c * 5) % 7,
      likedByMe: c === 1,
    })),
);

const syncCommentCount = (tilId: number) => {
  const til = tils.find((t) => t.id === tilId);
  if (til) til.commentCount = comments.filter((c) => c.postId === tilId).length;
};
tils.forEach((t) => syncCommentCount(t.id));

const findTil = (tilId: number) => {
  const til = tils.find((t) => t.id === tilId);
  if (!til) throw new ApiError('TIL을 찾을 수 없습니다.', 404);
  return til;
};

// ---- API 와 같은 모양의 함수들 ----

export const hasTilLoginToken = () => true;

export const getTilCurrentUser = () => wait(ME);

/** API 처럼 응답의 page 는 0부터입니다. */
export function getTils(
  { tab, sort, page }: TilListQuery,
  size: number,
  popularPeriod: 'week' | 'all',
): Promise<Schemas['TilPageResponse']> {
  const time = (t: MockTil) => new Date(t.createdAt).getTime();
  // 이번 주 월요일 00:00 (인기 탭 period=week)
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  const filtered = tils.filter((t) => {
    if (tab === 'mine') return t.author.id === ME.id;
    if (tab === 'bookmarks') return t.bookmarkedByMe;
    if (tab === 'popular' && popularPeriod === 'week') return time(t) >= monday.getTime();
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    if (tab === 'popular') {
      return b.likeCount - a.likeCount || b.commentCount - a.commentCount || time(b) - time(a);
    }
    // 내 TIL · 북마크는 최신순 고정 (가짜 데이터에는 북마크 시각이 없어서 작성 시각으로)
    if (tab !== 'all') return time(b) - time(a);
    return sort === 'latest' ? time(b) - time(a) : time(a) - time(b);
  });
  const start = (page - 1) * size;
  return wait({
    items: sorted.slice(start, start + size),
    page: page - 1,
    size,
    hasNext: start + size < sorted.length,
  });
}

export function getMyTilStats(): Promise<Schemas['MyStatsResponse']> {
  const days = Array.from({ length: 91 }, (_, i) => {
    const date = new Date(now - (90 - i) * DAY).toISOString().slice(0, 10);
    return { date, count: (i * 7 + 3) % 5 === 0 ? 0 : (i * 3) % 4 };
  });
  return wait({
    totalTilCount: tils.filter((t) => t.author.id === ME.id).length,
    consecutiveWritingDays: 5,
    thisWeekWriteCount: 3,
    last13WeeksDailyWriteCounts: days,
  });
}

export function getTilWeeklyRanking(limit: number): Promise<Schemas['WeeklyRankingResponse']> {
  return wait({
    weekStart: new Date(now - 6 * DAY).toISOString(),
    weekEndExclusive: new Date(now + DAY).toISOString(),
    items: USERS.slice(1, 1 + limit).map((user, i) => ({
      rank: i + 1,
      user,
      writeCount: 7 - i * 2,
    })),
  });
}

export async function getTil(tilId: number): Promise<Schemas['TilResponse']> {
  return wait(findTil(tilId));
}

export function createTil(input: Schemas['CreateTilRequest']): Promise<Schemas['TilResponse']> {
  const createdAt = new Date().toISOString();
  const til: MockTil = {
    id: Math.max(0, ...tils.map((t) => t.id)) + 1,
    ...input,
    author: ME,
    createdAt,
    updatedAt: createdAt,
    likeCount: 0,
    commentCount: 0,
    bookmarkCount: 0,
    likedByMe: false,
    bookmarkedByMe: false,
  };
  tils = [til, ...tils];
  return wait(til);
}

export async function updateTil(
  tilId: number,
  input: Schemas['UpdateTilRequest'],
): Promise<Schemas['TilResponse']> {
  const til = findTil(tilId);
  if (til.author.id !== ME.id) throw new ApiError('수정 권한이 없습니다.', 403);
  til.title = input.title ?? til.title;
  til.body = input.body ?? til.body;
  til.updatedAt = new Date().toISOString();
  return wait(til);
}

export async function deleteTil(tilId: number): Promise<void> {
  findTil(tilId);
  tils = tils.filter((t) => t.id !== tilId);
  comments = comments.filter((c) => c.postId !== tilId);
  await wait(undefined);
}

export async function toggleTilLike(tilId: number): Promise<Schemas['LikeResponse']> {
  const til = findTil(tilId);
  til.likedByMe = !til.likedByMe;
  til.likeCount += til.likedByMe ? 1 : -1;
  return wait({ liked: til.likedByMe, likeCount: til.likeCount });
}

export async function toggleTilBookmark(tilId: number): Promise<Schemas['BookmarkResponse']> {
  const til = findTil(tilId);
  til.bookmarkedByMe = !til.bookmarkedByMe;
  til.bookmarkCount += til.bookmarkedByMe ? 1 : -1;
  return wait({ bookmarked: til.bookmarkedByMe, bookmarkCount: til.bookmarkCount });
}

export async function getTilComments(tilId: number): Promise<Schemas['CommentResponse'][]> {
  findTil(tilId);
  return wait(comments.filter((c) => c.postId === tilId));
}

export async function addTilComment(
  tilId: number,
  content: string,
): Promise<Schemas['CommentResponse']> {
  findTil(tilId);
  const comment: MockComment = {
    id: nextCommentId++,
    postId: tilId,
    content,
    author: ME,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    likedByMe: false,
  };
  comments = [...comments, comment];
  syncCommentCount(tilId);
  return wait(comment);
}

export async function toggleTilCommentLike(
  tilId: number,
  commentId: number,
): Promise<Schemas['LikeResponse']> {
  const comment = comments.find((c) => c.postId === tilId && c.id === commentId);
  if (!comment) throw new ApiError('댓글을 찾을 수 없습니다.', 404);
  comment.likedByMe = !comment.likedByMe;
  comment.likeCount += comment.likedByMe ? 1 : -1;
  return wait({ liked: comment.likedByMe, likeCount: comment.likeCount });
}

export async function deleteTilComment(tilId: number, commentId: number): Promise<void> {
  comments = comments.filter((c) => !(c.postId === tilId && c.id === commentId));
  syncCommentCount(tilId);
  await wait(undefined);
}
