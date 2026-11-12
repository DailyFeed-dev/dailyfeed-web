import Link from 'next/link';

import { BUTTON_ICON_SIZE, buttonClassName } from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import type { TilListQuery, TilListSort, TilListTab } from '@/types/til';

import { TIL_WRITE_HREF, tilListHref } from './tilBoardUrl';

const TABS: { key: TilListTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'popular', label: '인기' },
  { key: 'mine', label: '내 TIL' },
  { key: 'bookmarks', label: '북마크' },
];

// API 가 지원하는 정렬만 둡니다. (최신순 / 오래된순)
const SORTS: { key: TilListSort; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'oldest', label: '오래된순' },
];

/** 분류 · 정렬 · 새 TIL 작성 (디자인: Toolbar 67:7221) */
export default function TilBoardToolbar({ query }: { query: TilListQuery }) {
  const currentSort = SORTS.find((s) => s.key === query.sort) ?? SORTS[0];

  return (
    <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="게시글 분류" className="flex overflow-x-auto">
        {TABS.map((tab) => {
          const active = tab.key === query.tab;
          return (
            <Link
              key={tab.key}
              href={tilListHref(query, { tab: tab.key, page: 1 })}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center px-5 pt-3 text-base leading-[1.4] whitespace-nowrap ${
                active
                  ? 'border-b-2 border-[#685cf0] pb-3 font-semibold text-[#685cf0]'
                  : // 밑줄이 1px 얇은 만큼 아래 여백을 1px 늘려 탭 높이를 맞춥니다.
                    'border-b border-[#ecebf2] pb-[13px] font-medium text-[#6b6a7b] hover:text-[#1f1d2b]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-end gap-3">
        {/* 인기 탭은 좋아요 순으로 고정이라 정렬 메뉴를 숨깁니다. */}
        {query.tab !== 'popular' && (
          /* <details> 로 JS 없이 열고 닫는 정렬 메뉴. key 를 바꿔 이동 후 메뉴를 닫습니다. */
          <details key={`${query.tab}-${query.sort}`} className="group relative">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-[40px] border border-[#e2defd] bg-white py-2.5 pr-3.5 pl-4 text-sm leading-[1.4] font-medium text-[#1f1d2b] select-none [&::-webkit-details-marker]:hidden">
              {currentSort.label}
              <Icon
                name="chevron-down"
                size={16}
                className="transition-transform group-open:rotate-180"
              />
            </summary>
            <ul
              role="menu"
              className="absolute top-[calc(100%+6px)] right-0 z-10 min-w-30 rounded-xl border border-[#f0eff5] bg-white p-1.5 shadow-[0_12px_32px_rgba(31,28,43,0.12)]"
            >
              {SORTS.map((s) => {
                const active = s.key === query.sort;
                return (
                  <li key={s.key} role="none">
                    <Link
                      role="menuitemradio"
                      aria-checked={active}
                      href={tilListHref(query, { sort: s.key, page: 1 })}
                      className={`block rounded-lg px-3 py-2 text-sm hover:bg-[#f6f5fb] ${
                        active ? 'font-semibold text-[#4b3fd6]' : 'font-medium text-[#6b6a7b]'
                      }`}
                    >
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        )}

        {/* 페이지 이동 버튼이라 Link 에 공통 버튼 스타일(buttonClassName)을 붙입니다. */}
        <Link
          href={TIL_WRITE_HREF}
          className={buttonClassName({
            variant: 'primary',
            size: 'md',
            className: 'shadow-[0_6px_16px_rgba(97,87,233,0.3)]',
          })}
        >
          <Icon name="plus" size={BUTTON_ICON_SIZE.md} />새 TIL 작성
        </Link>
      </div>
    </div>
  );
}
