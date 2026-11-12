import Link from 'next/link';
import type { BoardCategory } from '../boardCategories';
import { boardListHref } from '../boardUrl';

const BUTTON =
  'inline-flex h-9 items-center rounded-full border border-zinc-300 bg-white px-4 text-[13px] leading-normal font-semibold text-[#1F1D2B] hover:bg-zinc-50';
const DISABLED = `${BUTTON} pointer-events-none opacity-40`;

// 게시글 목록 하단 — 이전 / 현재 페이지 / 다음
// API 가 전체 개수를 주지 않아서 다음 페이지가 있는지(hasNext)만으로 이동합니다.
export default function BoardPagination({
  page,
  hasNext,
  category,
}: {
  page: number;
  hasNext: boolean;
  category?: BoardCategory;
}) {
  return (
    <nav aria-label="페이지 이동" className="flex items-center justify-center gap-4 py-6">
      {page > 1 ? (
        <Link href={boardListHref({ category, page: page - 1 })} className={BUTTON}>
          이전
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED}>
          이전
        </span>
      )}
      <span aria-current="page" className="text-sm font-semibold text-[#1F1D2B]">
        {page}
      </span>
      {hasNext ? (
        <Link href={boardListHref({ category, page: page + 1 })} className={BUTTON}>
          다음
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED}>
          다음
        </span>
      )}
    </nav>
  );
}
