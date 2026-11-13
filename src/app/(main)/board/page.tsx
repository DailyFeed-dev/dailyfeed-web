import { Suspense } from 'react';
import BoardPage from '@/components/board/BoardPage';
import BoardListSkeleton from '@/components/board/templates/BoardListSkeleton';

// 페이지 파일은 얇게 유지하고, 실제 화면은 components/board 에서 만듭니다.
// searchParams 는 요청마다 달라지므로 Suspense 로 감싸고, 읽는 동안 목록 뼈대를 보여 줍니다.
export default function Page({ searchParams }: PageProps<'/board'>) {
  return (
    <Suspense fallback={<BoardListSkeleton />}>
      <BoardPage searchParams={searchParams} />
    </Suspense>
  );
}
