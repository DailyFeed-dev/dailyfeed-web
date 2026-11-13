'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import type { ChatUserId } from '@/types/chat';

import { CHAT_CANVAS_CLASS } from './chatLayout';
import { isUnauthorized } from './chatLogin';
import ChatRoom from './ChatRoom';
import ChatSidebar from './ChatSidebar';
import ChatStateMessage, { ChatStateIcon } from './ChatStateMessage';
import { useConversations } from './useConversations';
import { useFriends } from './useFriends';

function parsePeerId(value: string | null): ChatUserId | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

type ChatScreenProps = {
  onUnauthorized: () => void;
};

export default function ChatScreen({ onUnauthorized }: ChatScreenProps) {
  const searchParams = useSearchParams();
  const peerId = parsePeerId(searchParams.get('with'));
  const conversationsState = useConversations();
  const friendsState = useFriends();
  const unauthorized = isUnauthorized(conversationsState.error);

  useEffect(() => {
    if (unauthorized) onUnauthorized();
  }, [unauthorized, onUnauthorized]);

  const knownPeer = conversationsState.conversations.find(
    (conversation) => conversation.peer.id === peerId,
  )?.peer;

  return (
    <div className={CHAT_CANVAS_CLASS}>
      <ChatSidebar
        conversationsState={conversationsState}
        friendsState={friendsState}
        selectedPeerId={peerId}
        className={peerId ? 'hidden lg:flex' : 'flex'}
      />
      {peerId ? (
        <ChatRoom key={peerId} peerId={peerId} knownPeer={knownPeer} friendsState={friendsState} />
      ) : (
        <section
          aria-label="대화"
          className="hidden flex-1 items-center justify-center rounded-2xl bg-(--color-bg-surface) p-6 lg:flex"
        >
          <ChatStateMessage
            visual={<ChatStateIcon name="message" />}
            title="대화를 선택하세요"
            description={'왼쪽 목록에서 대화를 고르면\n여기에 메시지가 표시돼요'}
          />
        </section>
      )}
    </div>
  );
}
