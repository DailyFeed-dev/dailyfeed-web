import { Suspense } from 'react';
import BoardDetailPage from '@/components/board/BoardDetailPage';

// 페이지 파일은 얇게 유지하고, 실제 화면은 components/board 에서 만듭니다.
// params 는 요청마다 달라지므로 Suspense 로 감쌉니다.
export default function Page({ params }: PageProps<'/board/[postId]'>) {
  return (
    <Suspense fallback={null}>
      <BoardDetailPage params={params} />
    </Suspense>
  );
}
