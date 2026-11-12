'use client';

import { useCallback, useState } from 'react';

import type { Schemas } from '@/lib/api';
import { getMyProfileTils, getMyProfileTilStats } from '@/services/profileService';

import { getProfileMonth } from '../../profileActivity';
import { useProfileResource } from '../../shared/hooks/useProfileResource';

export function useProfileReflections() {
  const [selected, setSelected] = useState<Schemas['TilResponse'] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(0);
  const load = useCallback(
    async (signal: AbortSignal) => {
      const [tilPage, tilStats] = await Promise.all([
        getMyProfileTils(page, showAll ? 10 : 3, signal),
        getMyProfileTilStats(signal),
      ]);
      return { tilPage, tilStats };
    },
    [page, showAll],
  );
  const { data, isLoading, error, retry } = useProfileResource(`tils-${showAll}-${page}`, load);
  const month = getProfileMonth(new Date().toISOString());
  const records = data?.tilPage.items ?? [];

  const monthCount = (data?.tilStats.last13WeeksDailyWriteCounts ?? [])
    .filter((day) => day.date?.startsWith(month))
    .reduce((count, day) => count + (day.count ?? 0), 0);

  function toggleShowAll() {
    setShowAll((value) => !value);
    setPage(0);
  }

  return {
    data,
    isLoading,
    error,
    retry,
    month,
    records,
    monthCount,
    selected,
    setSelected,
    showAll,
    toggleShowAll,
    page,
    setPage,
  };
}
