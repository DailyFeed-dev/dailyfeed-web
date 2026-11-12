import { useEffect, useState } from 'react';

import { userService } from '@/services/chatService';
import type { ChatUser } from '@/types/chat';

const SEARCH_DELAY_MS = 300;

type SearchResult =
  { keyword: string; status: 'success'; users: ChatUser[] } | { keyword: string; status: 'error' };

async function searchOtherUsers(keyword: string, signal: AbortSignal) {
  const [me, users] = await Promise.all([
    userService.getMe(signal),
    userService.searchUsers(keyword, signal),
  ]);
  return users.filter((user) => user.id !== me.id);
}

export function useUserSearch() {
  const [query, setQueryValue] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const keyword = query.trim();

  useEffect(() => {
    if (!keyword) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchOtherUsers(keyword, controller.signal)
        .then((users) => setResult({ keyword, status: 'success', users }))
        .catch(() => {
          if (!controller.signal.aborted) setResult({ keyword, status: 'error' });
        });
    }, SEARCH_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword, retryCount]);

  const setQuery = (next: string) => {
    if (next.trim() !== keyword) setResult(null);
    setQueryValue(next);
  };

  const retry = () => {
    setResult(null);
    setRetryCount((count) => count + 1);
  };

  const resultForKeyword = keyword && result?.keyword === keyword ? result : null;

  return {
    query,
    setQuery,
    keyword,
    users: resultForKeyword?.status === 'success' ? resultForKeyword.users : [],
    searching: Boolean(keyword) && resultForKeyword === null,
    failed: resultForKeyword?.status === 'error',
    retry,
  };
}
