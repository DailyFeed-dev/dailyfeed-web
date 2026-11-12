import { useCallback, useEffect, useRef, useState } from 'react';

import { friendService } from '@/services/chatService';
import type { ChatRelation, ChatUserId } from '@/types/chat';

import { errorMessageOf } from './errorMessage';
import type { FriendsState } from './useFriends';

type PeerListStatus = 'friend' | 'sent' | 'received' | 'unlisted';

export function peerListStatusOf(friendsState: FriendsState, userId: ChatUserId): PeerListStatus {
  if (friendsState.friends.some((user) => user.id === userId)) return 'friend';
  if (friendsState.sentRequests.some((request) => request.user.id === userId)) return 'sent';
  if (friendsState.receivedRequests.some((request) => request.user.id === userId)) {
    return 'received';
  }
  return 'unlisted';
}

export function useFriendRelation(
  peerId: ChatUserId,
  peerListStatus: PeerListStatus,
  onChanged: () => void,
) {
  const [relation, setRelation] = useState<ChatRelation | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
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
        if (isStale()) return;
        setRelation(next);
        setLoadFailed(false);
      } catch {
        if (isStale()) return;
        setRelation(null);
        setLoadFailed(true);
      }
    },
    [peerId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, peerListStatus]);

  const runAction = async (action: () => Promise<void>, failMessage: string) => {
    setBusy(true);
    setActionError(null);
    try {
      try {
        await action();
        onChanged();
      } catch (error) {
        setActionError(errorMessageOf(error, failMessage));
      }
      await load();
    } finally {
      setBusy(false);
    }
  };

  const request = () =>
    runAction(() => friendService.sendFriendRequest(peerId), '친구 요청을 보내지 못했어요.');

  const cancel = () =>
    runAction(() => friendService.cancelFriendRequest(peerId), '친구 요청을 취소하지 못했어요.');

  const accept = () =>
    runAction(() => friendService.acceptFriendRequest(peerId), '친구 요청을 수락하지 못했어요.');

  const retryLoad = () => load();

  return { relation, loadFailed, busy, actionError, request, cancel, accept, retryLoad };
}

export type FriendRelationState = ReturnType<typeof useFriendRelation>;
