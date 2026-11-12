import type { Metadata } from 'next';

import TilBoardPage from '@/components/til/TilBoardPage';
import { parseTilListQuery } from '@/components/til/tilBoardUrl';

export const metadata: Metadata = {
  title: 'TIL · 학습 게시판 | DailyFeed',
};

// 페이지 파일은 얇게 유지하고, 실제 화면은 components/til 에서 만듭니다.
export default async function Page({ searchParams }: PageProps<'/til'>) {
  const query = parseTilListQuery(await searchParams);
  return <TilBoardPage query={query} />;
}
