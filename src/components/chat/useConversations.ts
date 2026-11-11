import { useCallback, useEffect, useState } from 'react';

import { chatRealtime } from '@/services/chatService';
import type { ChatConversation } from '@/types/chat';

type ConversationsState = {
  conversations: ChatConversation[];
  loaded: boolean;
  error: unknown;
};

export function useConversations() {
  const [state, setState] = useState<ConversationsState>({
    conversations: [],
    loaded: false,
    error: null,
  });
  const [subscriptionRestartCount, setSubscriptionRestartCount] = useState(0);

  useEffect(
    () =>
      chatRealtime.subscribeConversations((event) => {
        if (event.type === 'snapshot') {
          setState({ conversations: event.conversations, loaded: true, error: null });
          return;
        }
        setState((current) => ({ ...current, error: event.error }));
      }),
    [subscriptionRestartCount],
  );

  const retry = useCallback(() => {
    setState((current) => ({ ...current, error: null }));
    setSubscriptionRestartCount((count) => count + 1);
  }, []);

  return { ...state, retry };
}

export type ConversationsResult = ReturnType<typeof useConversations>;
