// 글쓰기 헤더 — 폼 상단의 제목과 필수 입력 안내
export default function BoardWriteHeader() {
  return (
    <div className="flex items-center gap-3">
      <h2 className="flex-1 text-lg leading-[1.55] font-bold text-[#201D2B]">게시글 작성</h2>
      <p className="text-xs leading-[1.55] text-[#74717F]">* 필수 입력</p>
    </div>
  );
}
