import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TilDetailPage from '@/components/til/TilDetailPage';
import { parseTilId } from '@/components/til/tilBoardUrl';

export const metadata: Metadata = {
  title: 'TIL | DailyFeed',
};

// /til/view?id=13 — 페이지 파일은 얇게 유지하고, 실제 화면은 components/til 에서 만듭니다.
export default async function Page({ searchParams }: PageProps<'/til/view'>) {
  const tilId = parseTilId((await searchParams).id);
  if (tilId === null) notFound();
  return <TilDetailPage tilId={tilId} />;
}
