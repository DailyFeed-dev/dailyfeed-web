import Link from 'next/link';

// 게시글 작성 하단 — 취소, 임시저장, 글 등록하기
// 임시저장과 등록은 아직 동작하지 않습니다. API 연결 후 붙여 주세요.
export default function BoardWriteActions() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <Link
          href="/board"
          className="py-[11px] text-[13px] leading-[1.55] font-medium text-[#74717F] hover:text-[#201D2B]"
        >
          취소
        </Link>
        <span className="flex-1" />
        <button
          type="button"
          className="rounded-[21px] border border-[#E7E5EE] bg-white px-6 py-[11px] text-[13px] leading-[1.55] font-medium text-[#201D2B] hover:bg-zinc-50"
        >
          임시저장
        </button>
        <button
          type="button"
          className="h-[42px] w-[113px] rounded-[20px] bg-[#6157E9] text-[13px] leading-normal font-medium text-white transition-colors hover:bg-[#4B3FD6]"
        >
          글 등록하기
        </button>
      </div>
      <p className="text-xs leading-[1.55] text-[#74717F]">
        등록한 글은 게시판에서 누구나 확인할 수 있어요.
      </p>
    </div>
  );
}
