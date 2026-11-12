import { POST_GRID } from './BoardPostRow';

// 게시글 목록을 불러오는 동안 보여 주는 자리 표시 줄입니다. BoardPostRow 와 같은 칸 구성·높이를 씁니다.
export default function BoardPostRowSkeleton() {
  return (
    <div className={`${POST_GRID} h-17 border-b border-zinc-200`} aria-hidden="true">
      <span className="h-5 w-12 justify-self-center rounded-full bg-zinc-200" />
      <div className="flex min-w-0 flex-col gap-1.5 pr-6">
        <span className="h-3.5 w-3/5 rounded bg-zinc-200" />
        <span className="h-3 w-2/5 rounded bg-zinc-100" />
      </div>
      <span className="h-3.5 w-14 justify-self-center rounded bg-zinc-200" />
      <span className="h-3.5 w-16 justify-self-center rounded bg-zinc-200" />
      <span className="h-3.5 w-8 justify-self-center rounded bg-zinc-200" />
      <span className="h-3.5 w-8 justify-self-center rounded bg-zinc-200" />
    </div>
  );
}
