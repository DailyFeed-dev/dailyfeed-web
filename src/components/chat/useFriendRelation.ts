import { useCallback, useEffect, useRef, useState } from 'react';

import { friendService } from '@/services/chatService';
import type { ChatRelation, ChatRelationStatus, ChatUserId } from '@/types/chat';

import { errorMessageOf } from './errorMessage';
import type { FriendsState } from './useFriends';

type PeerListStatus = 'friend' | 'sent' | 'received' | 'unlisted';

const RELATION_RECHECK_MS = 5000;
const STATUSES_TO_RECHECK: ChatRelationStatus[] = ['none', 'sent', 'received', 'blockedMe'];

type LoadOptions = {
  signal?: AbortSignal;
  quiet?: boolean;
};

export function peerListStatusOf(friendsState: FriendsState, userId: ChatUserId): PeerListStatus {
  if (friendsState.friends.some((user) => user.id === userId)) return 'friend';
  if (friendsState.sentRequests.some((request) => request.user.id === userId)) return 'sent';
  if (friendsState.receivedRequests.some((request) => request.user.id === userId)) {
    return 'received';
  }
  return 'unlisted';
}

export function useRelationRecheck(
  status: ChatRelationStatus | undefined,
  loadQuietly: (signal: AbortSignal) => Promise<ChatRelation | null>,
  onChanged: () => void,
) {
  useEffect(() => {
    if (!status || !STATUSES_TO_RECHECK.includes(status)) return;
    const controller = new AbortController();
    let checking = false;
    const recheck = async () => {
      if (checking) return;
      checking = true;
      try {
        const next = await loadQuietly(controller.signal);
        if (next && next.status !== status) onChanged();
      } finally {
        checking = false;
      }
    };
    const recheckIfVisible = () => {
      if (document.visibilityState === 'visible') void recheck();
    };
    const timer = setInterval(recheckIfVisible, RELATION_RECHECK_MS);
    document.addEventListener('visibilitychange', recheckIfVisible);
    window.addEventListener('focus', recheckIfVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', recheckIfVisible);
      window.removeEventListener('focus', recheckIfVisible);
      controller.abort();
    };
  }, [status, loadQuietly, onChanged]);
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
    async ({ signal, quiet = false }: LoadOptions = {}): Promise<ChatRelation | null> => {
      if (!quiet) latestLoadId.current += 1;
      const loadId = latestLoadId.current;
      const isStale = () => signal?.aborted || loadId !== latestLoadId.current;
      try {
        const next = await friendService.getRelation(peerId, signal);
        if (isStale()) return null;
        setRelation(next);
        setLoadFailed(false);
        return next;
      } catch {
        if (isStale() || quiet) return null;
        setRelation(null);
        setLoadFailed(true);
        return null;
      }
    },
    [peerId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load({ signal: controller.signal });
    return () => controller.abort();
  }, [load, peerListStatus]);

  const loadQuietly = useCallback((signal: AbortSignal) => load({ signal, quiet: true }), [load]);
  useRelationRecheck(relation?.status, loadQuietly, onChanged);

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

  const removeFriend = () =>
    runAction(() => friendService.removeFriend(peerId), '친구를 삭제하지 못했어요.');

  const block = () => runAction(() => friendService.blockUser(peerId), '차단하지 못했어요.');

  const unblock = () =>
    runAction(() => friendService.unblockUser(peerId), '차단을 해제하지 못했어요.');

  const retryLoad = () => load();

  return {
    relation,
    loadFailed,
    busy,
    actionError,
    request,
    cancel,
    accept,
    removeFriend,
    block,
    unblock,
    retryLoad,
  };
}

export type FriendRelationState = ReturnType<typeof useFriendRelation>;
