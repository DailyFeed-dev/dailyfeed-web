import type { BoardCategory } from './boardCategories';

// 게시판 목록 주소. 주소의 page 는 1부터 시작하고(API 는 0부터), 1페이지와 전체 카테고리는 생략합니다.
export function boardListHref({ category, page }: { category?: BoardCategory; page?: number }) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (page && page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/board?${query}` : '/board';
}

// ?page= 값을 검사합니다. 생략하면 1, 1 이상의 정수가 아니면 undefined(잘못된 값)입니다.
export function parsePage(value: string | string[] | undefined): number | undefined {
  if (value === undefined) return 1;
  const raw = Array.isArray(value) ? value[0] : value;
  return /^[1-9]\d*$/.test(raw) ? Number(raw) : undefined;
}
