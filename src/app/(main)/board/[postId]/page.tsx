import { Suspense } from 'react';
import BoardDetailPage from '@/components/board/BoardDetailPage';
import BoardDetailSkeleton from '@/components/board/templates/BoardDetailSkeleton';

// 페이지 파일은 얇게 유지하고, 실제 화면은 components/board 에서 만듭니다.
// params 는 요청마다 달라지므로 Suspense 로 감싸고, 읽는 동안 상세 뼈대를 보여 줍니다.
export default function Page({ params }: PageProps<'/board/[postId]'>) {
  return (
    <Suspense fallback={<DetailFallback />}>
      <BoardDetailPage params={params} />
    </Suspense>
  );
}

// 주소를 읽는 동안에도 실제 화면과 같은 폭 안에서 뼈대를 보여 줍니다.
function DetailFallback() {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col py-8">
      <BoardDetailSkeleton />
    </div>
  );
}
