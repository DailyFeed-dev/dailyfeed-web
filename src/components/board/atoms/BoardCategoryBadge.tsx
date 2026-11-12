import {
  BOARD_CATEGORIES,
  CATEGORY_BADGE_COLOR,
  NO_CATEGORY_BADGE,
  type BoardCategory,
} from '../boardCategories';

// 카테고리 배지 — 카테고리마다 색이 다르고, 카테고리가 없으면 회색 "없음"을 보여 줍니다.
export default function BoardCategoryBadge({
  code,
  className = '',
}: {
  code?: string | null;
  className?: string;
}) {
  const category = BOARD_CATEGORIES.find((item) => item.code === code);
  const label = category?.label ?? NO_CATEGORY_BADGE.label;
  const color = category
    ? CATEGORY_BADGE_COLOR[category.code as BoardCategory]
    : NO_CATEGORY_BADGE.color;

  return (
    <span
      className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-[13px] leading-normal font-medium ${color} ${className}`}
    >
      {label}
    </span>
  );
}
