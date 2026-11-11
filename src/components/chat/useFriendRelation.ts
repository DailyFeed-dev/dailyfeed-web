import { useCallback, useEffect, useRef, useState } from 'react';

import { friendService } from '@/services/chatService';
import type { ChatRelation, ChatUserId } from '@/types/chat';

import { errorMessageOf } from './errorMessage';
import type { FriendsState } from './useFriends';

type ListedRelation = 'friend' | 'sent' | 'received' | 'none';

export function listedRelationOf(friendsState: FriendsState, userId: ChatUserId): ListedRelation {
  if (friendsState.friends.some((user) => user.id === userId)) return 'friend';
  if (friendsState.sentRequests.some((request) => request.user.id === userId)) return 'sent';
  if (friendsState.receivedRequests.some((request) => request.user.id === userId)) {
    return 'received';
  }
  return 'none';
}

export function useFriendRelation(
  peerId: ChatUserId,
  listedRelation: ListedRelation,
  onChanged: () => void,
) {
  const [relation, setRelation] = useState<ChatRelation | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const latestLoadId = useRef(0);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      latestLoadId.current += 1;
      const loadId = latestLoadId.current;
      const isStale = () => signal?.aborted || loadId !== latestLoadId.current;
      try {
        const next = await friendService.getRelation(peerId, signal);
        if (!isStale()) setRelation(next);
      } catch {
        if (!isStale()) setRelation(null);
      }
    },
    [peerId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, listedRelation]);

  const runAction = async (action: () => Promise<void>, failMessage: string) => {
    setBusy(true);
    setActionError(null);
    try {
      await action();
      onChanged();
    } catch (error) {
      setActionError(errorMessageOf(error, failMessage));
    } finally {
      setBusy(false);
    }
    await load();
  };

  const request = () =>
    runAction(() => friendService.sendFriendRequest(peerId), '친구 요청을 보내지 못했어요.');

  const cancel = () =>
    runAction(() => friendService.cancelFriendRequest(peerId), '친구 요청을 취소하지 못했어요.');

  const accept = () =>
    runAction(() => friendService.acceptFriendRequest(peerId), '친구 요청을 수락하지 못했어요.');

  return { relation, busy, actionError, request, cancel, accept };
}

export type FriendRelationState = ReturnType<typeof useFriendRelation>;
