import Link from 'next/link';

import { TilIcon } from './TilTempUi';

type Props = {
  page: number;
  /** 다음 페이지가 있는지 (API 가 전체 페이지 수 대신 hasNext 를 줍니다) */
  hasNext: boolean;
  hrefFor: (page: number) => string;
  /** 현재 페이지 앞쪽으로 보여줄 번호 개수 */
  before?: number;
};

// TODO: 공통 IconButton 컴포넌트가 완성되면 이전/다음 버튼을 교체합니다.
const buttonClass =
  'inline-flex size-9 items-center justify-center rounded-[10px] border text-sm leading-[1.4]';
const normalClass = `${buttonClass} border-[#e2defd] bg-white font-medium text-[#6b6a7b] hover:bg-[#f6f5fb]`;
const activeClass = `${buttonClass} border-[#685cf0] bg-[#685cf0] font-semibold text-white`;
const disabledClass = `${normalClass} pointer-events-none opacity-40`;

/**
 * 게시판 페이지 번호 (디자인: Pagination 67:7407)
 * 전체 페이지 수를 모르므로 [이전 번호들 · 현재 · 다음(있으면)] 만 보여줍니다.
 */
export default function TilPagination({ page, hasNext, hrefFor, before = 3 }: Props) {
  const start = Math.max(1, page - before);
  const pages = Array.from({ length: page - start + 1 }, (_, i) => start + i);
  if (hasNext) pages.push(page + 1);

  const arrow = (dir: 'prev' | 'next') => {
    const target = dir === 'prev' ? page - 1 : page + 1;
    const disabled = dir === 'prev' ? page <= 1 : !hasNext;
    const label = dir === 'prev' ? '이전 페이지' : '다음 페이지';
    const icon = <TilIcon name={dir === 'prev' ? 'chevron-left' : 'chevron-right'} />;

    if (disabled) {
      return (
        <span className={disabledClass} aria-label={label} aria-disabled="true">
          {icon}
        </span>
      );
    }
    return (
      <Link href={hrefFor(target)} className={normalClass} aria-label={label}>
        {icon}
      </Link>
    );
  };

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-2 pt-2">
      {arrow('prev')}
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? 'page' : undefined}
          className={p === page ? activeClass : normalClass}
        >
          {p}
        </Link>
      ))}
      {arrow('next')}
    </nav>
  );
}
