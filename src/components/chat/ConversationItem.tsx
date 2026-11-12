import Link from 'next/link';

import Badge from '@/components/common/Badge';
import type { ChatConversation } from '@/types/chat';

import ChatAvatar from './ChatAvatar';
import { formatRoomTime } from './chatTime';
import { UNKNOWN_USER_NAME } from './useChatPeer';

type ConversationItemProps = {
  conversation: ChatConversation;
  selected: boolean;
};

export default function ConversationItem({ conversation, selected }: ConversationItemProps) {
  const { peer, lastMessage, unreadCount } = conversation;
  const name = peer.name || UNKNOWN_USER_NAME;

  return (
    <Link
      href={`/chat?with=${peer.id}`}
      scroll={false}
      aria-current={selected ? 'page' : undefined}
      className={`flex h-[68px] items-center gap-3 rounded-xl p-3 ${
        selected ? 'bg-(--color-bg-brand-soft)' : 'hover:bg-(--color-bg-subtle)'
      }`}
    >
      <ChatAvatar name={name} src={peer.avatarUrl} size={44} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]">
        <p className="truncate text-[15px] font-semibold text-(--color-text-primary)">{name}</p>
        <p className="truncate text-[13px] text-(--color-text-secondary)">
          {lastMessage?.content ?? ''}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {lastMessage && (
          <time
            dateTime={lastMessage.createdAt}
            className="text-xs leading-[1.45] text-(--color-text-muted)"
          >
            {formatRoomTime(lastMessage.createdAt)}
          </time>
        )}
        {unreadCount > 0 && !selected && (
          <Badge tone="solid" aria-label={`안 읽은 메시지 ${unreadCount}개`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>
    </Link>
  );
}
