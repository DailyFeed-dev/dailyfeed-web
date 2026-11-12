'use client';

import { useEffect, useState } from 'react';

import {
  TIL_POPULAR_PERIOD,
  getMyTilStats,
  getTilWeeklyRanking,
  getTils,
} from '@/services/tilService';
import type { Schemas } from '@/lib/api';
import type { TilListQuery, TilListTab } from '@/types/til';

import TilBoardBanner from './TilBoardBanner';
import { TilPostCardSkeleton } from './TilBoardSkeleton';
import TilBoardToolbar from './TilBoardToolbar';
import TilNotice from './TilNotice';
import TilPagination from './TilPagination';
import TilPostCard from './TilPostCard';
import { TilStreakWidget, TilTopWritersWidget } from './TilSideWidgets';
import { TIL_WRITE_HREF, isUnauthorized, tilErrorMessage, tilListHref } from './tilBoardUrl';

type ListState = { key: string; data?: Schemas['TilPageResponse']; error?: unknown };

// 탭마다 글이 없을 때 보여줄 안내
const EMPTY: Record<TilListTab, { message: string; link?: { href: string; label: string } }> = {
  all: { message: '아직 작성된 TIL이 없어요.' },
  popular: {
    message:
      TIL_POPULAR_PERIOD === 'week'
        ? '이번 주 인기 TIL이 아직 없어요.'
        : '아직 작성된 TIL이 없어요.',
  },
  mine: {
    message: '아직 작성한 TIL이 없어요. 오늘 배운 것을 기록해 보세요.',
    link: { href: TIL_WRITE_HREF, label: '새 TIL 작성' },
  },
  bookmarks: { message: '북마크한 TIL이 없어요. 상세 화면에서 저장을 눌러 보세요.' },
};
type SideState = {
  stats?: Schemas['MyStatsResponse'];
  ranking?: Schemas['WeeklyRankingResponse'];
};

/** TIL 메인 게시판 (디자인: TIL Board 66:7894) */
export default function TilBoardPage({ query }: { query: TilListQuery }) {
  const { tab, sort, page } = query;
  // 조회 조건이 바뀌었는지 비교하는 값 (주소와 같습니다)
  const queryKey = tilListHref(query, {});

  const [list, setList] = useState<ListState | null>(null);
  const [side, setSide] = useState<SideState | null>(null);

  // 목록: 탭 · 정렬 · 페이지가 바뀔 때마다 다시 불러옵니다.
  useEffect(() => {
    let ignore = false;
    getTils({ tab, sort, page }).then(
      (data) => {
        if (!ignore) setList({ key: queryKey, data });
      },
      (error: unknown) => {
        if (!ignore) setList({ key: queryKey, error });
      },
    );
    return () => {
      ignore = true;
    };
  }, [queryKey, tab, sort, page]);

  // 사이드 위젯: 처음 한 번만 불러옵니다. 하나가 실패해도 나머지는 보여줍니다.
  useEffect(() => {
    let ignore = false;
    Promise.allSettled([getMyTilStats(), getTilWeeklyRanking(3)]).then(([stats, ranking]) => {
      if (ignore) return;
      setSide({
        stats: stats.status === 'fulfilled' ? stats.value : undefined,
        ranking: ranking.status === 'fulfilled' ? ranking.value : undefined,
      });
    });
    return () => {
      ignore = true;
    };
  }, []);

  const loading = list?.key !== queryKey;
  const data = list?.data;
  const items = data?.items ?? [];
  const hasNext = data?.hasNext ?? false;

  const renderList = () => {
    if (list?.error && !loading) {
      return (
        <TilNotice
          message={tilErrorMessage(list.error, 'TIL 목록을 불러오지 못했어요.')}
          // 로그인하면 지금 보던 탭 · 정렬 · 페이지로 돌아옵니다.
          loginReturnTo={isUnauthorized(list.error) ? queryKey : undefined}
        />
      );
    }
    if (!data) return Array.from({ length: 3 }, (_, i) => <TilPostCardSkeleton key={i} />);
    if (items.length === 0) {
      if (page > 1) {
        return (
          <TilNotice
            message="이 페이지에는 TIL이 없어요."
            link={{ href: tilListHref(query, { page: 1 }), label: '첫 페이지로' }}
          />
        );
      }
      return <TilNotice {...EMPTY[tab]} />;
    }
    return (
      // 새 조건을 불러오는 동안에는 이전 목록을 흐리게 보여줍니다.
      <ul className={`flex flex-col gap-4 transition-opacity ${loading ? 'opacity-50' : ''}`}>
        {items.map((til) => (
          <li key={til.id}>
            <TilPostCard til={til} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-310 flex-col gap-6 pt-6 pb-30">
      <TilBoardBanner />

      <TilBoardToolbar query={query} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4" aria-busy={loading}>
          {renderList()}

          {/* 지금 쪽은 주소 기준(1부터). 응답의 page 는 0부터라 쓰지 않습니다. */}
          {data && (page > 1 || hasNext) && (
            <TilPagination
              page={page}
              hasNext={hasNext}
              hrefFor={(p) => tilListHref(query, { page: p })}
            />
          )}
        </div>

        {side && (side.stats || side.ranking) && (
          <aside className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:*:flex-[1_1_320px] lg:w-84 lg:flex-none lg:flex-col lg:*:flex-none">
            {side.stats && <TilStreakWidget stats={side.stats} />}
            {side.ranking && <TilTopWritersWidget ranking={side.ranking} />}
          </aside>
        )}
      </div>
    </div>
  );
}
