// 댓글을 불러오는 동안 보여 주는 자리 표시입니다. (댓글 영역과 게시글 상세 뼈대가 함께 씁니다)
export default function BoardCommentSkeleton() {
  return (
    <div role="status" aria-label="댓글을 불러오는 중" className="animate-pulse">
      <div className="h-7 w-24 rounded bg-zinc-100" />
      <div className="mt-4 h-[88px] rounded-2xl bg-zinc-100" />
      <div className="mt-6 flex flex-col gap-6">
        {[0, 1].map((index) => (
          <div key={index} className="flex gap-3">
            <span className="size-9 shrink-0 rounded-full bg-zinc-200" />
            <div className="flex flex-1 flex-col gap-2 pt-1">
              <span className="h-3 w-24 rounded bg-zinc-200" />
              <span className="h-3.5 w-3/4 rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
