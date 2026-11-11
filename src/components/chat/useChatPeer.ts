import { useEffect, useState } from 'react';

import { userService } from '@/services/chatService';
import type { ChatUser, ChatUserId } from '@/types/chat';

export const UNKNOWN_USER_NAME = '알 수 없는 사용자';

export function useChatPeer(peerId: ChatUserId, knownPeer: ChatUser | undefined): ChatUser {
  const [loadedPeer, setLoadedPeer] = useState<ChatUser | null>(null);
  const needsLookup = !knownPeer;

  useEffect(() => {
    if (!needsLookup) return;
    const controller = new AbortController();
    userService
      .getUser(peerId, controller.signal)
      .then(setLoadedPeer)
      .catch(() => undefined);
    return () => controller.abort();
  }, [peerId, needsLookup]);

  const peer = knownPeer ?? loadedPeer;
  return {
    id: peerId,
    name: peer?.name || UNKNOWN_USER_NAME,
    avatarUrl: peer?.avatarUrl ?? null,
  };
}
