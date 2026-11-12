// 게시판 카테고리. URL 의 ?category= 값과 같은 코드를 씁니다. (생략하면 전체)
export const BOARD_CATEGORIES = [
  { code: 'FREE', label: '자유글' },
  { code: 'QUESTION', label: '질문' },
  { code: 'INFO', label: '정보' },
  { code: 'REVIEW', label: '후기' },
] as const;

export type BoardCategory = (typeof BOARD_CATEGORIES)[number]['code'];

// 카테고리별 배지 색. 카테고리가 없는 글은 NO_CATEGORY_BADGE 로 "없음"을 보여 줍니다.
export const CATEGORY_BADGE_COLOR: Record<BoardCategory, string> = {
  FREE: 'bg-indigo-50 text-indigo-600',
  QUESTION: 'bg-amber-50 text-amber-700',
  INFO: 'bg-emerald-50 text-emerald-700',
  REVIEW: 'bg-rose-50 text-rose-600',
};
export const NO_CATEGORY_BADGE = { label: '없음', color: 'bg-zinc-100 text-zinc-500' };

export function getCategoryLabel(code: string): string {
  return BOARD_CATEGORIES.find((category) => category.code === code)?.label ?? code;
}

// ?category= 값을 검사합니다. 목록에 없는 값이면 undefined(전체)로 취급합니다.
export function parseCategory(value: string | string[] | undefined): BoardCategory | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return BOARD_CATEGORIES.find((category) => category.code === raw)?.code;
}
