import BoardNotFound from '@/components/board/templates/BoardNotFound';

// /board 아래에서 notFound() 가 불리면 이 화면을 보여 줍니다. (사이트 전체 404 는 건드리지 않습니다)
export default function NotFound() {
  return <BoardNotFound />;
}
