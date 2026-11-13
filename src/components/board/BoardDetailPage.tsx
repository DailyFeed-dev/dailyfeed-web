import { notFound } from 'next/navigation';
import BoardDetailView from './templates/BoardDetailView';

type BoardDetailPageProps = {
  params: Promise<{ postId: string }>;
};

// 게시판 상세 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { postId } = await params;
  // 1 이상의 정수가 아닌 주소(/board/abc, /board/1e3, /board/0x10, /board/0, /board/-1)는 없는 페이지로 처리합니다.
  const id = Number(postId);
  if (!/^[1-9]\d*$/.test(postId) || !Number.isSafeInteger(id)) notFound();

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col py-8">
      <BoardDetailView postId={id} />
    </div>
  );
}
