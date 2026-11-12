import type { Metadata } from 'next';

import HomePage from '@/components/home/HomePage';

// 메인화면(/) 정보: 브라우저 탭 제목 · 검색 결과 · 링크 공유 미리보기에 쓰입니다.
export const metadata: Metadata = {
  title: 'DailyFeed · 매일 한 줄씩, 함께 쌓는 기록',
  description:
    '오늘 배운 것을 TIL로 남기고, 게시판에서 자료와 고민을 나누는 개발자 커뮤니티 DailyFeed',
};

// 페이지 파일은 얇게 유지하고, 실제 화면은 components/home 에서 만듭니다.
export default function Page() {
  return <HomePage />;
}
