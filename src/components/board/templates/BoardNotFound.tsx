'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonClassName } from '@/components/common/Button';
import BoardErrorScreen from '../organisms/BoardErrorScreen';

// 없는 글이거나 잘못된 주소(/board/abc 등)일 때 보여 주는 404 화면입니다. (디자인: 오류 안내 668:2979)
export default function BoardNotFound() {
  const router = useRouter();

  // 이전 기록이 없으면(주소를 직접 열었을 때) 뒤로 갈 곳이 없어서 게시판 목록으로 보냅니다.
  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push('/board');
  }

  return (
    <BoardErrorScreen
      mark="404"
      title="페이지를 찾을 수 없어요"
      description={[
        '주소가 잘못 입력되었거나, 페이지가 이동 또는 삭제되었어요.',
        '입력하신 주소를 다시 확인해 주세요.',
      ]}
    >
      <button
        type="button"
        onClick={goBack}
        className={buttonClassName({ variant: 'outline', size: 'lg' })}
      >
        이전 페이지로
      </button>
      <Link href="/" className={buttonClassName({ variant: 'primary', size: 'lg' })}>
        홈으로 가기
      </Link>
    </BoardErrorScreen>
  );
}
