/** 작성 · 수정 화면을 불러오는 동안 보여주는 뼈대 */
export default function TilEditorSkeleton() {
  return (
    <div
      role="status"
      aria-label="편집 화면을 불러오는 중"
      className="-mx-4 grid h-[calc(100dvh-6.25rem)] animate-pulse grid-rows-[72px_minmax(0,1fr)] bg-white sm:-mx-10 lg:-mx-20"
    >
      <div className="border-b border-[#f0eff5]" />
      <div className="flex flex-col gap-5 px-6 py-8 sm:px-12 sm:py-10">
        <div className="h-10 w-2/3 rounded bg-[#ecebf2]" />
        <div className="h-1.25 w-16 rounded-[3px] bg-[#e2defd]" />
        <div className="h-11 w-full max-w-xl rounded-[10px] bg-[#f6f5fb]" />
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-5 rounded bg-[#f0eff5]" style={{ width: `${80 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}
