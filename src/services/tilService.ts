import { api, tokenStorage, type Schemas } from '@/lib/api';
import type { TilListQuery } from '@/types/til';

import * as mock from './tilMockService';

/**
 * TIL · 학습 게시판 API 함수입니다. (백엔드 /api/v1/tils)
 * 화면 컴포넌트는 api 를 직접 부르지 않고 이 파일의 함수만 사용합니다.
 * 요청 · 응답 타입은 Schemas['...'] (schema.d.ts) 를 그대로 씁니다.
 * 실패하면 ApiError 를 던집니다. (401 = 로그인 필요, 403 = 권한 없음, 404 = 없음)
 */

const BASE = '/api/v1/tils';

/**
 * true 면 백엔드 대신 가짜 데이터(tilMockService.ts)로 동작합니다. (로그인 없이 화면 테스트용)
 * TODO: 백엔드로 테스트할 수 있으면 false 로 바꾸고, 이 스위치와 tilMockService.ts 를 지웁니다.
 */
const USE_TIL_MOCK = true;

export const TIL_PAGE_SIZE = 10;

// ---- 로그인 사용자 ----

/**
 * 로그인 토큰이 있는지 (브라우저에서만 확인 가능, 서버 렌더링 중에는 false).
 * 토큰이 만료됐을 수는 있지만, 그 경우 API 가 401 을 돌려주므로 그때 다시 로그인 화면으로 보냅니다.
 */
export function hasTilLoginToken(): boolean {
  if (USE_TIL_MOCK) return mock.hasTilLoginToken();
  return !!tokenStorage.getAccessToken();
}

/**
 * 지금 로그인한 사용자. 로그인 안 했으면 ApiError(401)
 * 글 · 댓글 작성자와 비교하기 쉽게 작성자 모양(AuthorResponse)으로 돌려줍니다.
 */
export async function getTilCurrentUser(): Promise<Schemas['AuthorResponse']> {
  if (USE_TIL_MOCK) return mock.getTilCurrentUser();
  const me = await api.get<Schemas['AuthResponse']>('/api/v1/auth/me');
  return { id: me.userId, name: me.name, avatarUrl: me.avatarUrl };
}

// ---- 게시판 ----

/** 인기 탭 기간. week = 이번 주(KST 월요일 00:00 부터), all = 전체 */
export const TIL_POPULAR_PERIOD: 'week' | 'all' = 'week';

/**
 * TIL 목록. 탭마다 다른 API 를 부릅니다. (응답 모양은 모두 TilPageResponse)
 * - 전체    GET /api/v1/tils?sort=latest|oldest
 * - 인기    GET /api/v1/tils/popular?period=   (좋아요 → 댓글 → 최신 순, 정렬 고정)
 * - 내 TIL  GET /api/v1/tils/me                 (최신순 고정)
 * - 북마크  GET /api/v1/tils/me/bookmarks       (북마크한 순서, 최근 먼저)
 * query.page 는 1부터, 응답의 page 는 API 그대로 0부터입니다.
 */
export function getTils({ tab, sort, page }: TilListQuery): Promise<Schemas['TilPageResponse']> {
  if (USE_TIL_MOCK) return mock.getTils({ tab, sort, page }, TIL_PAGE_SIZE, TIL_POPULAR_PERIOD);
  const paging = { page: page - 1, size: TIL_PAGE_SIZE };
  switch (tab) {
    case 'popular':
      return api.get<Schemas['TilPageResponse']>(`${BASE}/popular`, {
        query: { ...paging, period: TIL_POPULAR_PERIOD },
      });
    case 'mine':
      return api.get<Schemas['TilPageResponse']>(`${BASE}/me`, { query: paging });
    case 'bookmarks':
      return api.get<Schemas['TilPageResponse']>(`${BASE}/me/bookmarks`, { query: paging });
    default:
      return api.get<Schemas['TilPageResponse']>(BASE, { query: { ...paging, sort } });
  }
}

/** 내 학습 현황 (보드 위젯) */
export function getMyTilStats(): Promise<Schemas['MyStatsResponse']> {
  if (USE_TIL_MOCK) return mock.getMyTilStats();
  return api.get<Schemas['MyStatsResponse']>(`${BASE}/me/stats`);
}

/** 이번 주 TIL 작성자 랭킹 */
export function getTilWeeklyRanking(limit = 3): Promise<Schemas['WeeklyRankingResponse']> {
  if (USE_TIL_MOCK) return mock.getTilWeeklyRanking(limit);
  return api.get<Schemas['WeeklyRankingResponse']>(`${BASE}/rankings/weekly`, {
    query: { limit },
  });
}

// ---- 상세 · 작성 · 수정 · 삭제 ----

/** TIL 상세 */
export function getTil(tilId: number): Promise<Schemas['TilResponse']> {
  if (USE_TIL_MOCK) return mock.getTil(tilId);
  return api.get<Schemas['TilResponse']>(`${BASE}/${tilId}`);
}

/** TIL 작성. 만든 TIL 을 돌려줍니다. */
export function createTil(input: Schemas['CreateTilRequest']): Promise<Schemas['TilResponse']> {
  if (USE_TIL_MOCK) return mock.createTil(input);
  return api.post<Schemas['TilResponse']>(BASE, input);
}

/** TIL 수정 (작성자만) */
export function updateTil(
  tilId: number,
  input: Schemas['UpdateTilRequest'],
): Promise<Schemas['TilResponse']> {
  if (USE_TIL_MOCK) return mock.updateTil(tilId, input);
  return api.put<Schemas['TilResponse']>(`${BASE}/${tilId}`, input);
}

/** TIL 삭제 (작성자만) */
export async function deleteTil(tilId: number): Promise<void> {
  if (USE_TIL_MOCK) return mock.deleteTil(tilId);
  await api.delete(`${BASE}/${tilId}`);
}

/** 좋아요 토글 (누를 때마다 켜짐 ↔ 꺼짐) */
export function toggleTilLike(tilId: number): Promise<Schemas['LikeResponse']> {
  if (USE_TIL_MOCK) return mock.toggleTilLike(tilId);
  return api.post<Schemas['LikeResponse']>(`${BASE}/${tilId}/likes`);
}

/** 북마크(저장) 토글 */
export function toggleTilBookmark(tilId: number): Promise<Schemas['BookmarkResponse']> {
  if (USE_TIL_MOCK) return mock.toggleTilBookmark(tilId);
  return api.post<Schemas['BookmarkResponse']>(`${BASE}/${tilId}/bookmarks`);
}

// ---- 댓글 ----

/** 댓글 목록 (오래된 순) */
export function getTilComments(tilId: number): Promise<Schemas['CommentResponse'][]> {
  if (USE_TIL_MOCK) return mock.getTilComments(tilId);
  return api.get<Schemas['CommentResponse'][]>(`${BASE}/${tilId}/comments`);
}

/** 댓글 작성 */
export function addTilComment(tilId: number, content: string): Promise<Schemas['CommentResponse']> {
  if (USE_TIL_MOCK) return mock.addTilComment(tilId, content);
  const body: Schemas['CreateCommentRequest'] = { content };
  return api.post<Schemas['CommentResponse']>(`${BASE}/${tilId}/comments`, body);
}

/** 댓글 좋아요 토글 */
export function toggleTilCommentLike(
  tilId: number,
  commentId: number,
): Promise<Schemas['LikeResponse']> {
  if (USE_TIL_MOCK) return mock.toggleTilCommentLike(tilId, commentId);
  return api.post<Schemas['LikeResponse']>(`${BASE}/${tilId}/comments/${commentId}/likes`);
}

/** 댓글 삭제 (작성자만) */
export async function deleteTilComment(tilId: number, commentId: number): Promise<void> {
  if (USE_TIL_MOCK) return mock.deleteTilComment(tilId, commentId);
  await api.delete(`${BASE}/${tilId}/comments/${commentId}`);
}
