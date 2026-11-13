import Link from 'next/link';
import { BOARD_CATEGORIES, type BoardCategory } from '../boardCategories';
import { TAB_WIDTH } from '../boardTabStyles';

// 탭 목록 — 전체는 ?category= 를 생략한 주소(/board)입니다.
const TABS = [
  { code: undefined, label: '전체', href: '/board' },
  ...BOARD_CATEGORIES.map(({ code, label }) => ({
    code,
    label,
    href: `/board?category=${code}`,
  })),
];

// 게시글 메뉴바 — 카테고리 탭
// category: 현재 선택된 카테고리 (URL 의 ?category= 값, 없으면 전체)
export default function BoardPageMenuBar({ category }: { category?: BoardCategory }) {
  return (
    <nav aria-label="게시판 메뉴" className="pt-5 pb-5">
      <div role="tablist" className="flex border-b border-zinc-200">
        {TABS.map((tab) => {
          const isSelected = tab.code === category;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              role="tab"
              aria-selected={isSelected}
              className={`-mb-px flex ${TAB_WIDTH} flex-col items-stretch gap-2 pt-2 text-center text-base leading-[1.4] ${
                isSelected
                  ? 'font-semibold text-[#1F1D2B]'
                  : 'font-medium text-[#6C6980] hover:text-[#1F1D2B]'
              }`}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={`h-0.5 ${isSelected ? 'bg-indigo-600' : 'bg-transparent'}`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
