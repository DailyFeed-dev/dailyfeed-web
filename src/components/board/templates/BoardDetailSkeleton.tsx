import BoardCommentSkeleton from '../organisms/BoardCommentSkeleton';

const BAR = 'rounded bg-zinc-200';
const BAR_LIGHT = 'rounded bg-zinc-100';

// 게시글 상세를 불러오는 동안 보여 주는 뼈대입니다. BoardDetailPost 와 같은 카드 구조·간격을 씁니다.
export default function BoardDetailSkeleton() {
  return (
    <div role="status" aria-label="글을 불러오는 중" className="animate-pulse">
      {/* 상단 바: 목록 링크 + 현재 위치 */}
      <div className="mb-5 flex items-center justify-between">
        <span className={`h-[20px] w-28 ${BAR_LIGHT}`} />
        <span className={`h-3 w-20 ${BAR_LIGHT}`} />
      </div>

      <div aria-hidden="true" className="rounded-2xl border border-zinc-200 bg-white p-8">
        {/* 카테고리 배지 */}
        <span className="block h-5 w-12 rounded-full bg-zinc-200" />
        {/* 제목 */}
        <span className={`mt-3 block h-8 w-3/4 ${BAR}`} />
        {/* 작성자 줄 */}
        <div className="mt-4 flex items-center gap-3">
          <span className="size-10 shrink-0 rounded-full bg-zinc-200" />
          <span className="flex flex-col gap-1.5">
            <span className={`h-4 w-20 ${BAR}`} />
            <span className={`h-3 w-32 ${BAR_LIGHT}`} />
          </span>
        </div>
        {/* 본문 */}
        <div className="mt-6 flex flex-col gap-3">
          <span className={`h-4 w-full ${BAR_LIGHT}`} />
          <span className={`h-4 w-full ${BAR_LIGHT}`} />
          <span className={`h-4 w-11/12 ${BAR_LIGHT}`} />
          <span className={`h-4 w-full ${BAR_LIGHT}`} />
          <span className={`h-4 w-2/3 ${BAR_LIGHT}`} />
        </div>
        {/* 좋아요 */}
        <div className="mt-6 flex justify-center border-t border-zinc-200 pt-5">
          <span className="h-10 w-24 rounded-full bg-zinc-200" />
        </div>
      </div>

      <section className="mt-10">
        <BoardCommentSkeleton />
      </section>
    </div>
  );
}
