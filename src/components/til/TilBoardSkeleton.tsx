/** 게시판 목록을 불러오는 동안 보여주는 카드 자리 */
export function TilPostCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col gap-3 rounded-xl border border-[#e2defd] bg-white px-6 py-5"
    >
      <div className="h-6 w-24 rounded-md bg-[#f0eefe]" />
      <div className="h-6 w-2/3 rounded bg-[#ecebf2]" />
      <div className="h-5 w-full rounded bg-[#f0eff5]" />
      <hr className="border-t border-[#f0eff5]" />
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-[#ecebf2]" />
        <div className="h-5 w-16 rounded bg-[#f0eff5]" />
      </div>
    </div>
  );
}

/** 페이지 첫 진입 시(loading.tsx) 보여주는 게시판 뼈대 */
export default function TilBoardSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-310 flex-col gap-6 pt-6 pb-30"
      role="status"
      aria-label="TIL 게시판을 불러오는 중"
    >
      <div className="h-64 animate-pulse rounded-xl bg-[#e2defd]" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <TilPostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
