import Link from 'next/link';
import Button, { buttonClassName } from '@/components/common/Button';
import BoardErrorScreen from '../organisms/BoardErrorScreen';

// 글을 불러오지 못했을 때(404 가 아닌 오류) 보여 주는 화면입니다. (디자인: 오류 안내 676:2983)
// onRetry: "다시 시도"를 누르면 글을 다시 불러옵니다.
export default function BoardLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <BoardErrorScreen
      mark="!"
      title="글을 불러오지 못했어요"
      description={['일시적인 오류로 글을 불러오지 못했어요.', '잠시 후 다시 시도해 주세요.']}
    >
      <Link href="/board" className={buttonClassName({ variant: 'outline', size: 'lg' })}>
        게시판 목록으로
      </Link>
      <Button size="lg" onClick={onRetry}>
        다시 시도
      </Button>
    </BoardErrorScreen>
  );
}
