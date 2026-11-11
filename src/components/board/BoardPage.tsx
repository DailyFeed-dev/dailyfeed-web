import BoardHeader from './organisms/BoardHeader';
import BoardPageMenuBar from './organisms/BoardPageMenuBar';
import BoardPostList from './organisms/BoardPostList';

// 게시판 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
export default function BoardPage() {
  return (
    <>
      {/* 게시글 상단 */}
      <BoardHeader />
      {/* 게시글 메뉴바 */}
      <BoardPageMenuBar />
      {/* 글 메인 */}
      <BoardPostList />
    </>
  );
}
