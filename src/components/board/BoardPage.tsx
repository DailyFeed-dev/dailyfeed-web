import { redirect } from 'next/navigation';
import { parseCategory } from './boardCategories';
import { boardListHref, parsePage } from './boardUrl';
import BoardHeader from './templates/BoardHeader';
import BoardPageMenuBar from './organisms/BoardPageMenuBar';
import BoardPostList from './templates/BoardPostList';

type BoardPageProps = {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
};

// 게시판 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
// ?category=FREE|QUESTION|INFO|REVIEW 로 필터하고, ?page=2 처럼 페이지를 옮깁니다. (page 는 1부터)
// 생략하면 전체 / 1페이지, 잘못된 값이면 /board 로 이동합니다.
export default async function BoardPage({ searchParams }: BoardPageProps) {
  const { category: rawCategory, page: rawPage } = await searchParams;
  const category = parseCategory(rawCategory);
  const page = parsePage(rawPage);

  // 값이 있는데 목록에 없는 카테고리면 전체 목록(/board)으로 돌려보냅니다.
  if (rawCategory !== undefined && !category) redirect('/board');
  // 페이지가 1 이상의 정수가 아니면 같은 카테고리의 첫 페이지로 돌려보냅니다.
  if (page === undefined) redirect(boardListHref({ category }));

  return (
    <>
      {/* 게시글 상단 */}
      <BoardHeader />
      {/* 게시글 메뉴바 */}
      <BoardPageMenuBar category={category} />
      {/* 글 메인 */}
      <BoardPostList category={category} page={page} />
    </>
  );
}
