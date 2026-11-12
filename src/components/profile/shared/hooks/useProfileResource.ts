'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { NEXT_PARAM } from '@/components/auth/nextPath';
import { ApiError, tokenStorage } from '@/lib/api';

const LOGIN_HREF = `/login?${NEXT_PARAM}=${encodeURIComponent('/profile')}`;

type ResourceState<T> = { requestKey: string; data: T | null; error: string };
// 데이터 불러올 때 로딩 오류 재시도를 공통으로 관리하는 훅
export function useProfileResource<T>(key: string, load: (signal: AbortSignal) => Promise<T>) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${key}:${attempt}`;
  const [state, setState] = useState<ResourceState<T>>({ requestKey: '', data: null, error: '' });

  useEffect(() => {
    if (!tokenStorage.getAccessToken()) {
      router.replace(LOGIN_HREF);
      return;
    }

    const controller = new AbortController();

    async function loadResource() {
      try {
        const data = await load(controller.signal);
        if (data == null) throw new Error('조회 응답이 비어 있습니다.');
        if (!controller.signal.aborted) setState({ requestKey, data, error: '' });
      } catch (caught) {
        if (controller.signal.aborted) return;
        if (caught instanceof ApiError && caught.status === 401) {
          router.replace(LOGIN_HREF);
          return;
        }

        const error = caught instanceof Error ? caught.message : '정보를 불러오지 못했습니다.';
        setState({ requestKey, data: null, error });
      }
    }

    void loadResource();
    return () => controller.abort();
  }, [load, requestKey, router]);

  const isCurrent = state.requestKey === requestKey;
  return {
    data: isCurrent ? state.data : null,
    error: isCurrent ? state.error : '',
    isLoading: !isCurrent,
    retry: () => setAttempt((value) => value + 1),
    setData: (data: T) => setState({ requestKey, data, error: '' }),
  };
}
