import BoardDetailTopBar from './organisms/BoardDetailTopBar';
import BoardCommentSection from './templates/BoardCommentSection';
import BoardDetailPost from './templates/BoardDetailPost';

// 게시판 상세 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
export default function BoardDetailPage() {
  return (
    <div className="mx-auto w-full max-w-[720px] py-8">
      {/* 카테고리는 게시글 API 연결 후 게시글 데이터에서 받아 주세요. */}
      <BoardDetailTopBar category="템플릿" />
      <BoardDetailPost />
      <BoardCommentSection />
    </div>
  );
}
