// 게시판 카테고리. URL 의 ?category= 값과 같은 코드를 씁니다. (생략하면 전체)
export const BOARD_CATEGORIES = [
  { code: 'FREE', label: '자유글' },
  { code: 'QUESTION', label: '질문' },
  { code: 'INFO', label: '정보' },
  { code: 'REVIEW', label: '후기' },
] as const;

export type BoardCategory = (typeof BOARD_CATEGORIES)[number]['code'];

export function getCategoryLabel(code: string): string {
  return BOARD_CATEGORIES.find((category) => category.code === code)?.label ?? code;
}

// ?category= 값을 검사합니다. 목록에 없는 값이면 undefined(전체)로 취급합니다.
export function parseCategory(value: string | string[] | undefined): BoardCategory | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return BOARD_CATEGORIES.find((category) => category.code === raw)?.code;
}
