import { redirect } from 'next/navigation';
import { parseCategory } from './boardCategories';
import BoardHeader from './templates/BoardHeader';
import BoardPageMenuBar from './organisms/BoardPageMenuBar';
import BoardPostList from './templates/BoardPostList';

type BoardPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

// 게시판 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
// ?category=FREE|QUESTION|INFO|REVIEW 로 필터합니다. (생략하면 전체, 잘못된 값이면 /board 로 이동)
export default async function BoardPage({ searchParams }: BoardPageProps) {
  const { category: rawCategory } = await searchParams;
  const category = parseCategory(rawCategory);

  // 값이 있는데 목록에 없는 카테고리면 전체 목록(/board)으로 돌려보냅니다.
  if (rawCategory !== undefined && !category) redirect('/board');

  return (
    <>
      {/* 게시글 상단 */}
      <BoardHeader />
      {/* 게시글 메뉴바 */}
      <BoardPageMenuBar category={category} />
      {/* 글 메인 */}
      <BoardPostList category={category} />
    </>
  );
}
