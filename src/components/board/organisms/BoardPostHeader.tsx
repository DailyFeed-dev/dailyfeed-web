import { POST_GRID } from '../molecules/BoardPostRow';

// 게시글 목록 컬럼 헤더
export default function BoardPostHeader() {
  return (
    <div
      className={`${POST_GRID} h-11 bg-zinc-100 text-xs leading-normal text-[#6C6980]`}
      role="presentation"
    >
      {/* 제목을 뺀 나머지 칸은 아래 줄 값과 세로선이 맞도록 가운데 정렬 */}
      <span className="justify-self-center">카테고리</span>
      <span>글 제목</span>
      <span className="text-center">작성자</span>
      <span className="text-center">등록일</span>
      <span className="text-center">조회</span>
      <span className="text-center">좋아요</span>
    </div>
  );
}
