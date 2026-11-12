// TIL · 학습 게시판에서 프론트만 쓰는 타입입니다.
// API 요청 · 응답 타입은 직접 만들지 않고 Schemas['...'] 를 씁니다. (@/lib/api)
//   글 TilResponse · 목록 TilPageResponse · 작성자 AuthorResponse · 댓글 CommentResponse
//   작성 CreateTilRequest · 수정 UpdateTilRequest · 좋아요 LikeResponse · 북마크 BookmarkResponse
//   내 학습 현황 MyStatsResponse(날짜별 DailyWriteCountResponse) · 주간 랭킹 WeeklyRankingResponse

export type TilListSort = 'latest' | 'oldest';

/** 게시판 탭. all = 전체, popular = 인기(좋아요 많은 순), mine = 내 TIL, bookmarks = 북마크 */
export type TilListTab = 'all' | 'popular' | 'mine' | 'bookmarks';

/** 게시판 주소(?tab=&sort=&page=)로 정하는 조회 조건. page 는 1부터 시작합니다. (API 는 0부터 — 서비스에서 변환) */
export type TilListQuery = {
  tab: TilListTab;
  sort: TilListSort;
  page: number;
};

/** 아바타 · 프로필 팝오버에 보여줄 정보. Schemas['AuthorResponse'] 를 그대로 넘길 수 있습니다. */
export type TilProfile = {
  name?: string;
  /** "@minji.dev" — 있으면 프로필 팝오버에 표시 */
  handle?: string;
  /** 프로필 사진 URL (없으면 이름 첫 글자) */
  avatarUrl?: string;
  /** 아바타 배경색 (없으면 기본색) */
  avatarColor?: string;
  /** 아바타 글자색 (없으면 기본색) */
  avatarTextColor?: string;
};

export const TIL_TITLE_MAX = 200;
export const TIL_BODY_MAX = 50000;
