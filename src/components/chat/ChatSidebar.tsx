'use client';

import { useState } from 'react';

import Search from '@/components/common/Search';
import type { ChatUserId } from '@/types/chat';

import ChatIconButton from './ChatIconButton';
import ChatTabs, { CHAT_TAB_PANEL_ID, chatTabId, type ChatTab } from './ChatTabs';
import ConversationList from './ConversationList';
import FriendsPanel from './FriendsPanel';
import NewChatDialog from './NewChatDialog';
import type { ConversationsResult } from './useConversations';
import type { FriendsState } from './useFriends';

type ChatSidebarProps = {
  conversationsState: ConversationsResult;
  friendsState: FriendsState;
  selectedPeerId: ChatUserId | null;
  className?: string;
};

const SEARCH_PLACEHOLDER: Record<ChatTab, string> = {
  chats: '이름, 메시지 검색',
  friends: '친구 이름 검색',
};

export default function ChatSidebar({
  conversationsState,
  friendsState,
  selectedPeerId,
  className,
}: ChatSidebarProps) {
  const [tab, setTab] = useState<ChatTab>('chats');
  const [query, setQuery] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);

  const changeTab = (next: ChatTab) => {
    setTab(next);
    setQuery('');
    if (next === 'friends') void friendsState.reload();
  };

  const openNewChat = () => {
    void friendsState.reload();
    setNewChatOpen(true);
  };

  return (
    <section
      aria-label="채팅 목록"
      className={`min-h-0 w-full flex-col gap-4 rounded-2xl bg-(--color-bg-surface) px-4 pt-5 pb-4 lg:w-[344px] lg:shrink-0 ${className ?? ''}`}
    >
      <div className="flex items-center px-1">
        <h1 className="text-[22px] leading-[1.45] font-bold text-(--color-text-primary)">채팅</h1>
        <ChatIconButton icon="plus" label="새 채팅" className="ml-auto" onClick={openNewChat} />
      </div>
      <Search
        placeholder={SEARCH_PLACEHOLDER[tab]}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ChatTabs
        value={tab}
        onChange={changeTab}
        requestCount={friendsState.receivedRequests.length}
      />
      <div
        id={CHAT_TAB_PANEL_ID}
        role="tabpanel"
        aria-labelledby={chatTabId(tab)}
        className="flex min-h-0 flex-1 flex-col"
      >
        {tab === 'chats' ? (
          <ConversationList
            conversationsState={conversationsState}
            selectedPeerId={selectedPeerId}
            query={query}
            onStartNewChat={openNewChat}
          />
        ) : (
          <FriendsPanel friendsState={friendsState} query={query} />
        )}
      </div>
      {newChatOpen && (
        <NewChatDialog friendsState={friendsState} onClose={() => setNewChatOpen(false)} />
      )}
    </section>
  );
}
