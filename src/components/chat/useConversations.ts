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
  const [connection, setConnection] = useState(0);

  useEffect(
    () =>
      chatRealtime.subscribeConversations((event) => {
        if (event.type === 'snapshot') {
          setState({ conversations: event.conversations, loaded: true, error: null });
          return;
        }
        setState((current) => ({ ...current, error: event.error }));
      }),
    [connection],
  );

  const retry = useCallback(() => {
    setState((current) => ({ ...current, error: null }));
    setConnection((current) => current + 1);
  }, []);

  return { ...state, retry };
}

export type ConversationsResult = ReturnType<typeof useConversations>;
