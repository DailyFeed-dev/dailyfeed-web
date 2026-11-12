'use client';

import { useEffect, useRef, useState } from 'react';

import { friendService } from '@/services/chatService';
import type { ChatRelationStatus } from '@/types/chat';

import { TilIcon, type TilIconName } from './TilTempUi';

/**
 * 프로필 팝오버의 친구 버튼 (디자인: Profile Popover 599:2983 의 Friend=No / Friend=Yes)
 * 친구 API 는 채팅 화면과 같은 friendService(services/chatService.ts) 를 씁니다.
 * 그래서 가짜 데이터 / 실제 API 전환도 채팅과 같이 NEXT_PUBLIC_CHAT_ADAPTER 를 따릅니다.
 *
 * 백엔드 친구 기능은 요청 → 수락 방식이라, 디자인의 두 상태에 요청 상태를 더했습니다.
 * - 친구 아님 → '친구 추가' (요청 보내기)
 * - 요청 보냄 → '요청 보냄' (누르면 요청 취소)
 * - 요청 받음 → '친구 수락'
 * - 친구     → '친구' (누르면 확인 후 친구 끊기)
 * - 차단 · 불러오기 실패 → 버튼을 숨깁니다. (채팅 버튼은 그대로)
 */

const pillBase =
  'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border py-2 pr-[17px] pl-[15px] text-sm leading-[1.4] font-semibold whitespace-nowrap transition-[background-color,filter] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) disabled:cursor-progress disabled:opacity-70';

// Friend=No: 보라색 채움
const primaryClass = `${pillBase} border-(--color-border-brand) bg-(--color-bg-brand) text-white hover:enabled:brightness-[0.94]`;
// Friend=Yes: 흰 배경 + 회색 테두리
const outlineClass = `${pillBase} border-(--color-border-strong) bg-white text-(--color-text-secondary) hover:enabled:bg-(--color-bg-subtle)`;

type ButtonDef = {
  label: string;
  icon: TilIconName;
  className: string;
  /** 스크린 리더용 설명 (누르면 무슨 일이 일어나는지) */
  ariaLabel: (name: string) => string;
  action: (userId: number) => Promise<void>;
  failMessage: string;
  /** 누르기 전에 물어볼 문구 (없으면 바로 실행) */
  confirm?: (name: string) => string;
};

const BUTTONS: Partial<Record<ChatRelationStatus, ButtonDef>> = {
  none: {
    label: '친구 추가',
    icon: 'user-plus',
    className: primaryClass,
    ariaLabel: (name) => `${name}님에게 친구 요청 보내기`,
    action: (id) => friendService.sendFriendRequest(id),
    failMessage: '친구 요청을 보내지 못했어요.',
  },
  sent: {
    label: '요청 보냄',
    icon: 'user-plus',
    className: outlineClass,
    ariaLabel: (name) => `${name}님에게 친구 요청을 보냈어요. 누르면 요청을 취소해요`,
    action: (id) => friendService.cancelFriendRequest(id),
    failMessage: '친구 요청을 취소하지 못했어요.',
  },
  received: {
    label: '친구 수락',
    icon: 'user-check',
    className: primaryClass,
    ariaLabel: (name) => `${name}님의 친구 요청 수락하기`,
    action: (id) => friendService.acceptFriendRequest(id),
    failMessage: '친구 요청을 수락하지 못했어요.',
  },
  friend: {
    label: '친구',
    icon: 'user-check',
    className: outlineClass,
    ariaLabel: (name) => `${name}님과 친구예요. 누르면 친구를 끊어요`,
    action: (id) => friendService.removeFriend(id),
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
    return (await friendService.getRelation(userId, signal)).status;
  } catch {
    return null;
  }
}

export default function TilFriendButton({ userId, name = '' }: { userId: number; name?: string }) {
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

  // 불러오는 동안은 버튼 크기만큼 자리를 잡아 둡니다. (채팅 버튼이 옆으로 밀리지 않게)
  if (status === undefined) {
    return (
      <span
        aria-hidden="true"
        className="h-[38px] w-[104px] shrink-0 animate-pulse rounded-full bg-(--color-bg-subtle)"
      />
    );
  }

  const def = status ? BUTTONS[status] : undefined;
  if (!def) return null;

  const handleClick = async () => {
    if (busyRef.current) return;
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

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={def.ariaLabel(name)}
      className={def.className}
    >
      <TilIcon name={def.icon} />
      {def.label}
    </button>
  );
}
