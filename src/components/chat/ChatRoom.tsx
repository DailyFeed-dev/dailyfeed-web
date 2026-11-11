'use client';

import Link from 'next/link';

import Icon from '@/components/common/Icon';
import type { ChatUser, ChatUserId } from '@/types/chat';

import ChatAvatar from './ChatAvatar';
import { buildTimeline } from './chatTimeline';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import { useChatPeer } from './useChatPeer';
import { useChatRoom } from './useChatRoom';

type ChatRoomProps = {
  peerId: ChatUserId;
  knownPeer: ChatUser | undefined;
};

export default function ChatRoom({ peerId, knownPeer }: ChatRoomProps) {
  const peer = useChatPeer(peerId, knownPeer);
  const room = useChatRoom(peerId);
  const items = buildTimeline(room.messages, room.pending, peerId);

  return (
    <section
      aria-label={`${peer.name}님과의 대화`}
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-(--color-bg-surface)"
    >
      <header className="flex items-center gap-3 border-b border-(--color-border-default) py-4 pr-5 pl-4 sm:pl-6">
        <Link
          href="/chat"
          aria-label="채팅 목록으로"
          className="-ml-1 flex size-8 items-center justify-center rounded-full text-(--color-text-secondary) lg:hidden"
        >
          <Icon name="arrow-left" size={20} />
        </Link>
        <ChatAvatar name={peer.name} src={peer.avatarUrl} size={36} />
        <h2 className="truncate text-[17px] leading-[1.45] font-semibold text-(--color-text-primary)">
          {peer.name}
        </h2>
      </header>

      {room.status === 'loading' && (
        <p className="flex flex-1 items-center justify-center text-sm text-(--color-text-muted)">
          대화를 불러오는 중...
        </p>
      )}
      {room.status === 'error' && (
        <p
          role="alert"
          className="flex flex-1 items-center justify-center text-sm text-(--color-text-danger)"
        >
          대화를 불러오지 못했어요. 잠시 후 자동으로 다시 시도해요.
        </p>
      )}
      {room.status === 'ready' && (
        <MessageList
          items={items}
          peer={peer}
          hasOlder={room.hasOlder}
          loadingOlder={room.loadingOlder}
          olderError={room.olderError}
          onLoadOlder={room.loadOlder}
          onRetry={room.retry}
          onDiscard={room.discard}
        />
      )}

      <MessageComposer onSend={room.send} disabled={room.status !== 'ready'} />
    </section>
  );
}
