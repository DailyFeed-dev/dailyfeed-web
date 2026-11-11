'use client';

import { useState } from 'react';

import Icon from '@/components/common/Icon';
import Search from '@/components/common/Search';
import type { ChatConversation, ChatUserId } from '@/types/chat';

import ChatTabs, { type ChatTab } from './ChatTabs';
import ConversationItem from './ConversationItem';
import { useReceivedRequestCount } from './useReceivedRequestCount';

type ConversationListPanelProps = {
  conversations: ChatConversation[];
  loaded: boolean;
  selectedPeerId: ChatUserId | null;
  className?: string;
};

function matches(conversation: ChatConversation, query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;
  return [conversation.peer.name, conversation.lastMessage?.content ?? ''].some((text) =>
    text.toLowerCase().includes(keyword),
  );
}

export default function ConversationListPanel({
  conversations,
  loaded,
  selectedPeerId,
  className,
}: ConversationListPanelProps) {
  const [tab, setTab] = useState<ChatTab>('chats');
  const [query, setQuery] = useState('');
  const requestCount = useReceivedRequestCount();
  const visible = conversations.filter((conversation) => matches(conversation, query));

  return (
    <section
      aria-label="채팅 목록"
      className={`min-h-0 w-full flex-col gap-4 rounded-2xl bg-(--color-bg-surface) px-4 pt-5 pb-4 lg:w-[344px] lg:shrink-0 ${className ?? ''}`}
    >
      <div className="flex items-center px-1">
        <h1 className="text-[22px] leading-[1.45] font-bold text-(--color-text-primary)">채팅</h1>
        <button
          type="button"
          aria-label="새 채팅"
          className="ml-auto flex size-8 cursor-pointer items-center justify-center rounded-full bg-(--color-bg-brand-soft) text-(--color-text-brand)"
        >
          <Icon name="plus" size={18} />
        </button>
      </div>
      <Search
        placeholder="이름, 메시지 검색"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ChatTabs value={tab} onChange={setTab} requestCount={requestCount} />
      {tab === 'chats' && (
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
      )}
    </section>
  );
}
