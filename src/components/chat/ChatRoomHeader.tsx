import Link from 'next/link';

import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import type { ChatRelationStatus, ChatUser } from '@/types/chat';

import ChatAvatar from './ChatAvatar';
import type { FriendRelationState } from './useFriendRelation';

type ChatRoomHeaderProps = {
  peer: ChatUser;
  peerLoading: boolean;
  relationState: FriendRelationState;
};

const RELATION_TEXT: Record<ChatRelationStatus, string | null> = {
  none: '아직 친구가 아니에요',
  sent: '친구 요청을 보냈어요',
  received: '친구 요청을 받았어요',
  friend: null,
  blockedByMe: '차단한 사용자예요',
  blockedMe: '메시지를 보낼 수 없는 상대예요',
};

function RelationAction({ relationState }: { relationState: FriendRelationState }) {
  const { relation, busy } = relationState;
  if (!relation) return null;

  if (relation.status === 'none') {
    return (
      <Button
        variant="soft"
        size="md"
        icon="plus"
        disabled={busy}
        onClick={() => void relationState.request()}
      >
        친구 요청
      </Button>
    );
  }
  if (relation.status === 'sent') {
    return (
      <Button
        variant="outline"
        size="md"
        disabled={busy}
        onClick={() => void relationState.cancel()}
      >
        요청 취소
      </Button>
    );
  }
  if (relation.status === 'received') {
    return (
      <Button size="md" disabled={busy} onClick={() => void relationState.accept()}>
        수락
      </Button>
    );
  }
  return null;
}

function PeerSkeleton() {
  return (
    <div
      role="status"
      aria-label="상대 정보를 불러오는 중"
      className="flex flex-1 items-center gap-3"
    >
      <span className="size-9 shrink-0 animate-pulse rounded-full bg-(--color-border-default)" />
      <span className="flex animate-pulse flex-col gap-2">
        <span className="h-3.5 w-40 max-w-full rounded-md bg-(--color-border-default)" />
        <span className="h-2.5 w-[110px] max-w-full rounded-md bg-(--color-bg-subtle)" />
      </span>
    </div>
  );
}

export default function ChatRoomHeader({ peer, peerLoading, relationState }: ChatRoomHeaderProps) {
  const { relation, actionError } = relationState;
  const relationText = relation ? RELATION_TEXT[relation.status] : null;

  return (
    <header className="flex min-h-[73px] items-center gap-3 border-b border-(--color-border-default) py-4 pr-5 pl-4 sm:pl-6">
      <Link
        href="/chat"
        aria-label="채팅 목록으로"
        className="-ml-1 flex size-8 items-center justify-center rounded-full text-(--color-text-secondary) lg:hidden"
      >
        <Icon name="arrow-left" size={20} />
      </Link>
      {peerLoading ? (
        <PeerSkeleton />
      ) : (
        <>
          <ChatAvatar name={peer.name} src={peer.avatarUrl} size={36} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]">
            <h2 className="truncate text-[17px] font-semibold text-(--color-text-primary)">
              {peer.name}
            </h2>
            {actionError ? (
              <p role="alert" className="truncate text-xs text-(--color-text-danger)">
                {actionError}
              </p>
            ) : (
              relationText && (
                <p className="truncate text-xs text-(--color-text-secondary)">{relationText}</p>
              )
            )}
          </div>
          <RelationAction relationState={relationState} />
        </>
      )}
    </header>
  );
}
