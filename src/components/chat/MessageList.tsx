'use client';

import { useLayoutEffect, useRef } from 'react';

import type { ChatUser } from '@/types/chat';

import type { TimelineItem } from './chatTimeline';
import MessageRow from './MessageRow';

type MessageListProps = {
  items: TimelineItem[];
  peer: ChatUser;
  hasOlder: boolean;
  loadingOlder: boolean;
  olderError: string | null;
  onLoadOlder: () => void;
  onRetry: (clientId: string) => void;
  onDiscard: (clientId: string) => void;
};

const NEAR_BOTTOM_PX = 120;
const NEAR_TOP_PX = 80;

function olderButtonLabel(loading: boolean, error: string | null) {
  if (loading) return '불러오는 중...';
  if (error) return `${error} 다시 시도`;
  return '이전 메시지 보기';
}

function offsetTopOf(list: HTMLElement, key: string) {
  const row = list.querySelector<HTMLElement>(`[data-row-key="${CSS.escape(key)}"]`);
  return row ? row.offsetTop : null;
}

export default function MessageList({
  items,
  peer,
  hasOlder,
  loadingOlder,
  olderError,
  onLoadOlder,
  onRetry,
  onDiscard,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const lastRender = useRef({
    firstMessageKey: null as string | null,
    firstMessageOffset: 0,
    bottomKey: null as string | null,
    wasNearBottom: true,
  });

  const firstMessageKey = items.find((item) => item.kind !== 'divider')?.key ?? null;
  const bottomItem = items[items.length - 1];
  const bottomKey = bottomItem?.key ?? null;
  const bottomIsMine = bottomItem?.kind === 'outgoing' || bottomItem?.kind === 'pending';

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const before = lastRender.current;

    if (before.firstMessageKey && before.firstMessageKey !== firstMessageKey) {
      const movedOffset = offsetTopOf(list, before.firstMessageKey);
      if (movedOffset !== null) list.scrollTop += movedOffset - before.firstMessageOffset;
    }

    const hasNewBottom = bottomKey !== before.bottomKey;
    if (hasNewBottom && (before.wasNearBottom || bottomIsMine)) {
      list.scrollTop = list.scrollHeight;
    }

    lastRender.current = {
      ...before,
      firstMessageKey,
      firstMessageOffset: firstMessageKey ? (offsetTopOf(list, firstMessageKey) ?? 0) : 0,
      bottomKey,
    };
  }, [firstMessageKey, bottomKey, bottomIsMine]);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    const distanceFromBottom = list.scrollHeight - list.scrollTop - list.clientHeight;
    lastRender.current.wasNearBottom = distanceFromBottom < NEAR_BOTTOM_PX;
    const canLoadOlder = hasOlder && !loadingOlder && !olderError;
    if (list.scrollTop < NEAR_TOP_PX && canLoadOlder) onLoadOlder();
  };

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="relative flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto bg-[#fcfcfe] px-4 py-5 [overflow-anchor:none] sm:px-6"
    >
      <div className="mt-auto" />
      {hasOlder && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadOlder}
            disabled={loadingOlder}
            className="cursor-pointer text-xs leading-[1.45] text-(--color-text-muted) underline underline-offset-2 disabled:cursor-default disabled:no-underline"
          >
            {olderButtonLabel(loadingOlder, olderError)}
          </button>
        </div>
      )}
      {items.map((item) => (
        <div key={item.key} data-row-key={item.key}>
          <MessageRow item={item} peer={peer} onRetry={onRetry} onDiscard={onDiscard} />
        </div>
      ))}
    </div>
  );
}
