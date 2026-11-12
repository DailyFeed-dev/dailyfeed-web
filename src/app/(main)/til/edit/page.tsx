import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TilEditPage from '@/components/til/TilEditPage';
import { parseTilId } from '@/components/til/tilBoardUrl';

export const metadata: Metadata = {
  title: 'TIL 수정 | DailyFeed',
};

// /til/edit?id=13 — 페이지 파일은 얇게 유지하고, 실제 화면은 components/til 에서 만듭니다.
export default async function Page({ searchParams }: PageProps<'/til/edit'>) {
  const tilId = parseTilId((await searchParams).id);
  if (tilId === null) notFound();
  return <TilEditPage tilId={tilId} />;
}
