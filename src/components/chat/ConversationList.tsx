import type { ChatConversation, ChatUserId } from '@/types/chat';

import ConversationItem from './ConversationItem';

type ConversationListProps = {
  conversations: ChatConversation[];
  loaded: boolean;
  selectedPeerId: ChatUserId | null;
  query: string;
};

function matches(conversation: ChatConversation, query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;
  return [conversation.peer.name, conversation.lastMessage?.content ?? ''].some((text) =>
    text.toLowerCase().includes(keyword),
  );
}

export default function ConversationList({
  conversations,
  loaded,
  selectedPeerId,
  query,
}: ConversationListProps) {
  const visible = conversations.filter((conversation) => matches(conversation, query));

  return (
    <ul className="-mx-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-1">
      {!loaded && <li className="p-3 text-sm text-(--color-text-muted)">불러오는 중...</li>}
      {loaded && visible.length === 0 && (
        <li className="p-3 text-sm text-(--color-text-muted)">
          {query.trim() ? '검색 결과가 없어요.' : '아직 대화가 없어요.'}
        </li>
      )}
      {visible.map((conversation) => (
        <li key={conversation.peer.id}>
          <ConversationItem
            conversation={conversation}
            selected={conversation.peer.id === selectedPeerId}
          />
        </li>
      ))}
    </ul>
  );
}
