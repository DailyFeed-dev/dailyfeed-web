// 게시글 목록 하단 — 표시 개수, 페이지 번호, 페이지당 표시 수 (모양만 있고 동작은 아직 연결하지 않았습니다)
const PAGES = [1, 2, 3, 4, 5];

export default function BoardPagination() {
  const currentPage = 1;

  return (
    <div className="flex h-[95px] items-start justify-between pt-3.5">
      <p className="pt-1.5 text-xs leading-[1.5] text-[#6C6980]">128개 중 1–7개 표시</p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="이전 페이지"
          className="flex size-8 items-center justify-center rounded-full text-[#6C6980] hover:bg-zinc-100"
        >
          <ArrowIcon direction="left" />
        </button>
        {PAGES.map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? 'page' : undefined}
            className={`flex size-8 items-center justify-center rounded-full text-[13px] leading-[1.5] font-semibold ${
              page === currentPage ? 'bg-indigo-600 text-white' : 'text-[#1F1D2B] hover:bg-zinc-100'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지"
          className="flex size-8 items-center justify-center rounded-full text-[#6C6980] hover:bg-zinc-100"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-[13px] leading-[1.5] font-semibold text-[#1F1D2B] hover:bg-zinc-50"
      >
        페이지당 7개
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-3.5"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}
