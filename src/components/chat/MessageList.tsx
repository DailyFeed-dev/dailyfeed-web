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
  const previous = useRef({
    firstKey: null as string | null,
    lastKey: null as string | null,
    scrollHeight: 0,
    nearBottom: true,
  });

  const firstKey = items[0]?.key ?? null;
  const lastItem = items[items.length - 1];
  const lastKey = lastItem?.key ?? null;
  const lastIsMine = lastItem?.kind === 'outgoing' || lastItem?.kind === 'pending';

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const before = previous.current;
    const prepended =
      before.firstKey !== null && firstKey !== before.firstKey && lastKey === before.lastKey;
    if (prepended) {
      list.scrollTop += list.scrollHeight - before.scrollHeight;
    } else if (lastKey !== before.lastKey && (before.nearBottom || lastIsMine)) {
      list.scrollTop = list.scrollHeight;
    }
    previous.current = { ...before, firstKey, lastKey, scrollHeight: list.scrollHeight };
  }, [firstKey, lastKey, lastIsMine, items.length]);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    previous.current.nearBottom =
      list.scrollHeight - list.scrollTop - list.clientHeight < NEAR_BOTTOM_PX;
    if (list.scrollTop < NEAR_TOP_PX && hasOlder && !loadingOlder && !olderError) onLoadOlder();
  };

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto bg-[#fcfcfe] px-4 py-5 sm:px-6"
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
            {loadingOlder
              ? '불러오는 중...'
              : olderError
                ? `${olderError} 다시 시도`
                : '이전 메시지 보기'}
          </button>
        </div>
      )}
      {items.map((item) => (
        <MessageRow
          key={item.key}
          item={item}
          peer={peer}
          onRetry={onRetry}
          onDiscard={onDiscard}
        />
      ))}
    </div>
  );
}
