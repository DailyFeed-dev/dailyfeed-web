import { useEffect, useState } from 'react';

import { userService } from '@/services/chatService';
import type { ChatUser, ChatUserId } from '@/types/chat';

export const UNKNOWN_USER_NAME = '알 수 없는 사용자';

export function useChatPeer(peerId: ChatUserId, knownPeer: ChatUser | undefined) {
  const [loadedPeer, setLoadedPeer] = useState<ChatUser | null>(null);
  const [lookupFailed, setLookupFailed] = useState(false);
  const needsLookup = !knownPeer;

  useEffect(() => {
    if (!needsLookup) return;
    const controller = new AbortController();
    userService
      .getUser(peerId, controller.signal)
      .then(setLoadedPeer)
      .catch(() => {
        if (!controller.signal.aborted) setLookupFailed(true);
      });
    return () => controller.abort();
  }, [peerId, needsLookup]);

  const found = knownPeer ?? loadedPeer;
  const peer: ChatUser = {
    id: peerId,
    name: found?.name || UNKNOWN_USER_NAME,
    avatarUrl: found?.avatarUrl ?? null,
  };
  return { peer, loading: !found && !lookupFailed };
}
