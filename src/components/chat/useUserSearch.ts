import { useEffect, useState } from 'react';

import { userService } from '@/services/chatService';
import type { ChatUser, ChatUserId } from '@/types/chat';

const SEARCH_DELAY_MS = 300;

type SearchResult = {
  keyword: string;
  users: ChatUser[] | null;
};

export function useUserSearch(query: string) {
  const keyword = query.trim();
  const [myId, setMyId] = useState<ChatUserId | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    userService
      .getMe(controller.signal)
      .then((me) => setMyId(me.id))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!keyword) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      userService
        .searchUsers(keyword, controller.signal)
        .then((users) => setResult({ keyword, users }))
        .catch(() => {
          if (!controller.signal.aborted) setResult({ keyword, users: null });
        });
    }, SEARCH_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword, retryCount]);

  const current = keyword && result?.keyword === keyword ? result : null;

  const retry = () => {
    setResult(null);
    setRetryCount((count) => count + 1);
  };

  return {
    keyword,
    users: current?.users?.filter((user) => user.id !== myId) ?? [],
    searching: Boolean(keyword) && !current,
    failed: current?.users === null,
    retry,
  };
}
