import Button from '@/components/common/Button';
import type { ChatUserId } from '@/types/chat';

import { matchesQuery } from './chatSearch';
import { ChatListSkeleton } from './ChatSkeletons';
import ChatStateMessage, { ChatStateIcon } from './ChatStateMessage';
import ConversationItem from './ConversationItem';
import type { ConversationsResult } from './useConversations';

type ConversationListProps = {
  conversationsState: ConversationsResult;
  selectedPeerId: ChatUserId | null;
  query: string;
  onStartNewChat: () => void;
};

export default function ConversationList({
  conversationsState,
  selectedPeerId,
  query,
  onStartNewChat,
}: ConversationListProps) {
  const { conversations, loaded, error, retry } = conversationsState;

  if (!loaded && error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 p-3">
        <p className="text-sm text-(--color-text-danger)">대화 목록을 불러오지 못했어요.</p>
        <Button variant="outline" icon="refresh" onClick={retry}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (!loaded) return <ChatListSkeleton label="대화 목록을 불러오는 중" />;

  if (conversations.length === 0) {
    return (
      <ChatStateMessage
        visual={<ChatStateIcon name="message" />}
        title="아직 대화가 없어요"
        description={'게시판에서 프로필을 눌러\n1:1 채팅을 시작해 보세요'}
        className="pt-30"
      >
        <Button size="md" icon="plus" onClick={onStartNewChat}>
          새 채팅 시작
        </Button>
      </ChatStateMessage>
    );
  }

  const visible = conversations.filter(({ peer, lastMessage }) =>
    matchesQuery(query, peer.name, lastMessage?.content ?? ''),
  );

  return (
    <ul className="-mx-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-1">
      {visible.length === 0 && (
        <li className="p-3 text-sm text-(--color-text-muted)">검색 결과가 없어요.</li>
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
