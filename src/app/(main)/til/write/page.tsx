import type { Metadata } from 'next';

import TilWritePage from '@/components/til/TilWritePage';

export const metadata: Metadata = {
  title: '새 TIL 작성 | DailyFeed',
};

// 페이지 파일은 얇게 유지하고, 실제 화면은 components/til 에서 만듭니다.
export default function Page() {
  return <TilWritePage />;
}
