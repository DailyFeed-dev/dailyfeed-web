'use client';

import { useEffect, useEffectEvent, useState } from 'react';

type Result<T> = { key: string; data?: T; error?: unknown };

/**
 * API 데이터를 가져오는 훅입니다. key 가 바뀌면 다시 가져오고, 이전 요청은 취소합니다.
 * key 에는 요청에 쓰이는 값(페이지, 카테고리 등)을 문자열로 넣어 주세요.
 *
 * @example
 * const { data, error, loading } = useApiData(`posts:${category}`, (signal) =>
 *   getPosts({ category }, signal),
 * );
 */
export function useApiData<T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<Result<T> | null>(null);
  const run = useEffectEvent(fetcher);

  useEffect(() => {
    const controller = new AbortController();
    run(controller.signal)
      .then((data) => setResult({ key, data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setResult({ key, error });
      });
    return () => controller.abort();
  }, [key]);

  // 결과가 현재 key 의 것이 아니면 아직 가져오는 중입니다.
  const current = result?.key === key ? result : null;
  return { data: current?.data, error: current?.error, loading: current === null };
}
