import { useCallback, useEffect, useRef, useState } from 'react';

import { friendService } from '@/services/chatService';
import type { ChatFriendRequest, ChatUser, ChatUserId } from '@/types/chat';

import { errorMessageOf } from './errorMessage';

type FriendsData = {
  friends: ChatUser[];
  receivedRequests: ChatFriendRequest[];
  sentRequests: ChatFriendRequest[];
  loaded: boolean;
  loadError: string | null;
};

const EMPTY: FriendsData = {
  friends: [],
  receivedRequests: [],
  sentRequests: [],
  loaded: false,
  loadError: null,
};

export function useFriends() {
  const [data, setData] = useState<FriendsData>(EMPTY);
  const [busyUserIds, setBusyUserIds] = useState<ChatUserId[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const latestReloadId = useRef(0);

  const reload = useCallback(async (signal?: AbortSignal) => {
    latestReloadId.current += 1;
    const reloadId = latestReloadId.current;
    const isStale = () => signal?.aborted || reloadId !== latestReloadId.current;
    try {
      const [friends, requests] = await Promise.all([
        friendService.listFriends(signal),
        friendService.listFriendRequests(signal),
      ]);
      if (isStale()) return;
      setData({
        friends,
        receivedRequests: requests.received,
        sentRequests: requests.sent,
        loaded: true,
        loadError: null,
      });
    } catch (error) {
      if (isStale()) return;
      setData((current) => ({
        ...current,
        loaded: true,
        loadError: errorMessageOf(error, '친구 목록을 불러오지 못했어요.'),
      }));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  const runAction = useCallback(
    async (userId: ChatUserId, action: () => Promise<void>, failMessage: string) => {
      setBusyUserIds((ids) => [...ids, userId]);
      setActionError(null);
      try {
        await action();
        await reload();
      } catch (error) {
        setActionError(errorMessageOf(error, failMessage));
      } finally {
        setBusyUserIds((ids) => ids.filter((id) => id !== userId));
      }
    },
    [reload],
  );

  const accept = (userId: ChatUserId) =>
    runAction(
      userId,
      () => friendService.acceptFriendRequest(userId),
      '친구 요청을 수락하지 못했어요.',
    );

  const reject = (userId: ChatUserId) =>
    runAction(
      userId,
      () => friendService.rejectFriendRequest(userId),
      '친구 요청을 거절하지 못했어요.',
    );

  const cancel = (userId: ChatUserId) =>
    runAction(
      userId,
      () => friendService.cancelFriendRequest(userId),
      '친구 요청을 취소하지 못했어요.',
    );

  return { ...data, busyUserIds, actionError, reload, accept, reject, cancel };
}

export type FriendsState = ReturnType<typeof useFriends>;
