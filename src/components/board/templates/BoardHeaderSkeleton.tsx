// BoardHeader 가 준비되기 전에 보여 주는 자리 표시입니다. BoardHeader 와 같은 구조·높이를 씁니다.
export default function BoardHeaderSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse items-start justify-between gap-4 py-8">
      <div className="flex flex-col gap-2">
        {/* 제목 (30px × 1.3 = 39px) */}
        <div className="flex h-[39px] items-center">
          <span className="h-7 w-24 rounded bg-zinc-200" />
        </div>
        {/* 소개글 (14px × 1.55 ≈ 21.7px) */}
        <div className="flex h-[21.7px] items-center">
          <span className="h-3.5 w-64 rounded bg-zinc-100" />
        </div>
      </div>
      {/* 글쓰기 버튼 (py-2.5 + 20px 줄 높이 = 40px) */}
      <span className="h-10 w-[98px] shrink-0 rounded-full bg-zinc-200" />
    </div>
  );
}
