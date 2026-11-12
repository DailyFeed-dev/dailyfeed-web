/** 상세 페이지를 불러오는 동안 보여주는 뼈대 */
export default function TilDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="TIL을 불러오는 중"
      className="mx-auto flex w-full max-w-180 animate-pulse flex-col gap-4 pt-10 pb-30"
    >
      <div className="h-5 w-24 rounded bg-[#f0eff5]" />
      <div className="mt-4 h-6 w-28 rounded-md bg-[#f0eefe]" />
      <div className="h-10 w-4/5 rounded bg-[#ecebf2]" />
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#ecebf2]" />
        <div className="h-5 w-32 rounded bg-[#f0eff5]" />
      </div>
      <hr className="my-2 border-t border-[#ecebf2]" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-5 rounded bg-[#f0eff5]" style={{ width: `${90 - i * 8}%` }} />
      ))}
    </div>
  );
}
