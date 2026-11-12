'use client';

import { useCallback, useState } from 'react';

import type { Schemas } from '@/lib/api';
import { getMyProfilePosts } from '@/services/profileService';

import { useProfileResource } from '../../shared/hooks/useProfileResource';

export function useProfilePosts() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Schemas['PostResponse'] | null>(null);
  const load = useCallback((signal: AbortSignal) => getMyProfilePosts(page, signal), [page]);
  const { data, isLoading, error, retry } = useProfileResource(`posts-${page}`, load);

  return { page, setPage, selected, setSelected, data, isLoading, error, retry };
}
