'use client';

import { useSearchParams } from 'next/navigation';

import type { ChatUserId } from '@/types/chat';

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

export default function ChatScreen() {
  const searchParams = useSearchParams();
  const peerId = parsePeerId(searchParams.get('with'));
  const conversationsState = useConversations();
  const friendsState = useFriends();
  const knownPeer = conversationsState.conversations.find(
    (conversation) => conversation.peer.id === peerId,
  )?.peer;

  return (
    <div className="mb-6 flex h-[calc(100dvh-7.75rem)] min-h-[520px] gap-5 rounded-3xl bg-(--color-bg-subtle) p-3 sm:p-6">
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
