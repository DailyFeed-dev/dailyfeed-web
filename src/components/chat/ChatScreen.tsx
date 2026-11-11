'use client';

import { useSearchParams } from 'next/navigation';

import type { ChatUserId } from '@/types/chat';

import ChatRoom from './ChatRoom';
import ConversationListPanel from './ConversationListPanel';
import { useConversations } from './useConversations';

function parsePeerId(value: string | null): ChatUserId | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export default function ChatScreen() {
  const searchParams = useSearchParams();
  const peerId = parsePeerId(searchParams.get('with'));
  const { conversations, loaded } = useConversations();
  const knownPeer = conversations.find((conversation) => conversation.peer.id === peerId)?.peer;

  return (
    <div className="mb-6 flex h-[calc(100dvh-7.75rem)] min-h-[520px] gap-5 rounded-3xl bg-(--color-bg-subtle) p-3 sm:p-6">
      <ConversationListPanel
        conversations={conversations}
        loaded={loaded}
        selectedPeerId={peerId}
        className={peerId ? 'hidden lg:flex' : 'flex'}
      />
      {peerId ? (
        <ChatRoom key={peerId} peerId={peerId} knownPeer={knownPeer} />
      ) : (
        <section
          aria-label="대화"
          className="hidden flex-1 items-center justify-center rounded-2xl bg-(--color-bg-surface) text-sm text-(--color-text-muted) lg:flex"
        >
          대화를 선택해 주세요.
        </section>
      )}
    </div>
  );
}
