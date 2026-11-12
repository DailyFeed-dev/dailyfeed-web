import { notFound } from 'next/navigation';
import BoardDetailView from './templates/BoardDetailView';

type BoardDetailPageProps = {
  params: Promise<{ postId: string }>;
};

// 게시판 상세 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { postId } = await params;
  // 숫자가 아닌 주소(/board/abc)는 없는 페이지로 처리합니다.
  const id = Number(postId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  return (
    <div className="mx-auto w-full max-w-[720px] py-8">
      <BoardDetailView postId={id} />
    </div>
  );
}
