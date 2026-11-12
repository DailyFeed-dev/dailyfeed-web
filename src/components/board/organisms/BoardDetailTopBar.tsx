import Link from 'next/link';

// 게시글 상세 상단 — 목록으로 돌아가는 링크와 현재 위치(경로) 표시
export default function BoardDetailTopBar({ category }: { category?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <Link
        href="/board"
        className="text-[13px] leading-[1.55] font-medium text-[#74717F] hover:text-[#201D2B]"
      >
        ← 게시판 목록으로
      </Link>
      <p className="text-xs leading-[1.5] text-[#74717F]">
        {category ? `게시판 / ${category}` : '게시판'}
      </p>
    </div>
  );
}
