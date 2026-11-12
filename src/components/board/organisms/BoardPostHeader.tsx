import { POST_GRID } from '../molecules/BoardPostRow';

// 게시글 목록 컬럼 헤더
export default function BoardPostHeader() {
  return (
    <div
      className={`${POST_GRID} h-11 bg-zinc-100 text-xs leading-normal text-[#6C6980]`}
      role="presentation"
    >
      <span>카테고리</span>
      <span>글 제목</span>
      <span>작성자</span>
      <span>등록일</span>
      <span>조회</span>
      <span>반응 · 댓글</span>
    </div>
  );
}
