'use client';

import { useEffect, useRef, useState } from 'react';

import type { FriendButtonProps, FriendButtonView } from '@/components/common/FriendButton';
import { apiChatAdapter } from '@/services/chat/apiChatAdapter';
import type { ChatRelationStatus } from '@/types/chat';

const friendApi = apiChatAdapter.friends;

/**
 * 프로필 팝오버 친구 버튼의 동작입니다. 결과를 common/FriendButton 에 그대로 넘기면 됩니다.
 * 친구 API 는 채팅 팀이 만든 실제 API 함수(services/chat/apiChatAdapter.ts) 를 그대로 씁니다.
 *   GET /api/v1/friends/relationship/{userId}  관계 조회
 *   POST /api/v1/friends/requests              요청 보내기
 *   DELETE /api/v1/friends/requests/{userId}   요청 취소
 *   POST /api/v1/friends/requests/{userId}/accept  수락,  DELETE /api/v1/friends/{userId}  친구 끊기
 * 채팅의 가짜 데이터 설정(NEXT_PUBLIC_CHAT_ADAPTER)과 상관없이 항상 실제 API 를 부릅니다.
 *
 * 백엔드 친구 기능은 요청 → 수락 방식이라, 디자인의 두 상태에 요청 상태를 더했습니다.
 * - 친구 아님 → '친구 추가' (요청 보내기)
 * - 요청 보냄 → '요청 보냄' (누르면 요청 취소)
 * - 요청 받음 → '친구 수락'
 * - 친구     → '친구' (누르면 확인 후 친구 끊기)
 * - 차단 · 불러오기 실패 → 버튼을 숨깁니다.
 *
 * @example
 * const friend = useFriendRelation(userId, name);
 * <FriendButton {...friend} />
 */

type ActionDef = {
  view: (name: string) => FriendButtonView;
  action: (userId: number) => Promise<void>;
  failMessage: string;
  /** 누르기 전에 물어볼 문구 (없으면 바로 실행) */
  confirm?: (name: string) => string;
};

const ACTIONS: Partial<Record<ChatRelationStatus, ActionDef>> = {
  none: {
    view: (name) => ({
      label: '친구 추가',
      icon: 'user-plus',
      tone: 'primary',
      ariaLabel: `${name}님에게 친구 요청 보내기`,
    }),
    action: (id) => friendApi.sendFriendRequest(id),
    failMessage: '친구 요청을 보내지 못했어요.',
  },
  sent: {
    view: (name) => ({
      label: '요청 보냄',
      icon: 'user-plus',
      tone: 'outline',
      ariaLabel: `${name}님에게 친구 요청을 보냈어요. 누르면 요청을 취소해요`,
    }),
    action: (id) => friendApi.cancelFriendRequest(id),
    failMessage: '친구 요청을 취소하지 못했어요.',
  },
  received: {
    view: (name) => ({
      label: '친구 수락',
      icon: 'user-check',
      tone: 'primary',
      ariaLabel: `${name}님의 친구 요청 수락하기`,
    }),
    action: (id) => friendApi.acceptFriendRequest(id),
    failMessage: '친구 요청을 수락하지 못했어요.',
  },
  friend: {
    view: (name) => ({
      label: '친구',
      icon: 'user-check',
      tone: 'outline',
      ariaLabel: `${name}님과 친구예요. 누르면 친구를 끊어요`,
    }),
    action: (id) => friendApi.removeFriend(id),
    failMessage: '친구를 끊지 못했어요.',
    confirm: (name) => `${name}님과 친구를 끊을까요?`,
  },
};

function errorMessageOf(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

/** 나와 그 사용자의 관계. 불러오지 못하면 null */
async function fetchStatus(
  userId: number,
  signal?: AbortSignal,
): Promise<ChatRelationStatus | null> {
  try {
    return (await friendApi.getRelation(userId, signal)).status;
  } catch {
    return null;
  }
}

export function useFriendRelation(userId: number, name = ''): FriendButtonProps {
  // undefined = 불러오는 중, null = 불러오지 못함
  const [status, setStatus] = useState<ChatRelationStatus | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  // 버튼이 disabled 로 다시 그려지기 전에 연달아 누르는 것까지 막습니다.
  const busyRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    void fetchStatus(userId, controller.signal).then((next) => {
      if (!controller.signal.aborted) setStatus(next);
    });
    return () => controller.abort();
  }, [userId]);

  const def = status ? ACTIONS[status] : undefined;

  const onClick = async () => {
    if (!def || busyRef.current) return;
    if (def.confirm && !window.confirm(def.confirm(name))) return;
    busyRef.current = true;
    setBusy(true);
    try {
      await def.action(userId);
    } catch (error) {
      window.alert(errorMessageOf(error, def.failMessage));
    }
    // 성공 · 실패 모두 서버의 현재 관계로 다시 맞춥니다. (다른 곳에서 바뀌었을 수도 있어서)
    setStatus(await fetchStatus(userId));
    busyRef.current = false;
    setBusy(false);
  };

  return {
    loading: status === undefined,
    view: def ? def.view(name) : null,
    busy,
    onClick: () => void onClick(),
  };
}
