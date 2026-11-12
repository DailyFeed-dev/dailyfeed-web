import { NEXT_PARAM } from '@/components/auth/nextPath';
import { ApiError } from '@/lib/api';
import type { TilListQuery, TilListSort, TilListTab } from '@/types/til';

export const TIL_BOARD_BASE = '/til';
export const TIL_WRITE_HREF = '/til/write';

/**
 * 로그인 화면 주소. 로그인에 성공하면 returnTo(지금 보던 TIL 주소)로 돌아옵니다.
 * 로그인 화면의 ?next= 규칙(components/auth/nextPath.ts)을 따릅니다.
 * 예) tilLoginHref('/til/view?id=3') → /login?next=%2Ftil%2Fview%3Fid%3D3
 */
export function tilLoginHref(returnTo: string) {
  return `/login?${NEXT_PARAM}=${encodeURIComponent(returnTo)}`;
}

const TABS: TilListTab[] = ['all', 'popular', 'mine', 'bookmarks'];
const SORTS: TilListSort[] = ['latest', 'oldest'];

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// ---- 주소 ----

/** 주소의 쿼리(?tab=&sort=&page=)를 게시판 조회 조건으로 바꿉니다. 잘못된 값은 기본값으로. */
export function parseTilListQuery(searchParams: RawSearchParams): TilListQuery {
  const tab = first(searchParams.tab) as TilListTab;
  const sort = first(searchParams.sort) as TilListSort;
  const page = Number.parseInt(first(searchParams.page) ?? '1', 10);
  return {
    tab: TABS.includes(tab) ? tab : 'all',
    sort: SORTS.includes(sort) ? sort : 'latest',
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** 현재 조건에서 일부만 바꾼 게시판 주소. 기본값은 주소에서 생략합니다. */
export function tilListHref(current: TilListQuery, patch: Partial<TilListQuery>) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.tab !== 'all') params.set('tab', next.tab);
  // 정렬은 전체 탭에서만 씁니다.
  if (next.tab === 'all' && next.sort !== 'latest') params.set('sort', next.sort);
  if (next.page > 1) params.set('page', String(next.page));
  const qs = params.toString();
  return qs ? `${TIL_BOARD_BASE}?${qs}` : TIL_BOARD_BASE;
}

// 상세 · 수정은 /til/123 대신 쿼리(?id=123)를 씁니다.
// (주소에 변수가 있으면 공통 헤더의 usePathname 때문에 빌드가 막혀서)
// API 응답의 id 는 타입상 비어 있을 수 있어서(Schemas) undefined 도 받습니다. 그때는 잘못된 주소 → 404.
export function tilDetailHref(id: number | undefined) {
  return `${TIL_BOARD_BASE}/view?id=${id}`;
}

export function tilEditHref(id: number | undefined) {
  return `${TIL_BOARD_BASE}/edit?id=${id}`;
}

/** 그 사용자와의 채팅방 주소 (/chat?with=상대방 userId) */
export function tilChatHref(userId: number | undefined) {
  return userId === undefined ? '/chat' : `/chat?with=${userId}`;
}

/** 주소의 ?id= 값을 숫자로 바꿉니다. 잘못된 값이면 null */
export function parseTilId(raw: string | string[] | undefined): number | null {
  const id = Number(first(raw));
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ---- 날짜 · 글 ----

/** ISO 날짜 → "2026.11.10" (값이 없으면 빈 문자열) */
export function formatTilDate(iso: string | undefined) {
  if (!iso) return '';
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** ISO 날짜 → "2026.11.10 14:20" */
export function formatTilDateTime(iso: string | undefined) {
  if (!iso) return '';
  const date = new Date(iso);
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${formatTilDate(iso)} ${h}:${min}`;
}

/** ISO 날짜 → "방금 전", "3시간 전", "어제", "2일 전" … 일주일이 넘으면 날짜 */
export function formatTilRelativeTime(iso: string | undefined, now = Date.now()) {
  if (!iso) return '';
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  return formatTilDate(iso);
}

/** 마크다운 본문 → 목록 카드용 한 줄 요약 */
export function tilExcerpt(body = '') {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(#{1,6}|>|[-*+]( \[[ xX]\])?|\d+\.)\s+/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

/** 같은 사용자인지 (id 가 비어 있으면 다른 사람으로 봅니다) */
export function isSameUser(a: number | undefined, b: number | undefined) {
  return a !== undefined && a === b;
}

// ---- 에러 ----

/** 로그인이 필요한 에러(401)인지 */
export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

/** 화면에 보여줄 에러 문구 (서버가 보낸 메시지 우선) */
export function tilErrorMessage(error: unknown, fallback: string) {
  if (isUnauthorized(error)) return '로그인이 필요해요.';
  return error instanceof ApiError ? error.message : fallback;
}
