import type { KeyboardEvent } from 'react';

import Badge from '@/components/common/Badge';

export type ChatTab = 'chats' | 'friends';

export const CHAT_TAB_PANEL_ID = 'chat-tab-panel';

export function chatTabId(tab: ChatTab) {
  return `chat-tab-${tab}`;
}

type ChatTabsProps = {
  value: ChatTab;
  onChange: (tab: ChatTab) => void;
  requestCount: number;
};

const TABS: { value: ChatTab; label: string }[] = [
  { value: 'chats', label: '채팅' },
  { value: 'friends', label: '친구' },
];

export default function ChatTabs({ value, onChange, requestCount }: ChatTabsProps) {
  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const currentIndex = TABS.findIndex((tab) => tab.value === value);
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = TABS[(currentIndex + step + TABS.length) % TABS.length];
    onChange(next.value);
    document.getElementById(chatTabId(next.value))?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="채팅과 친구"
      onKeyDown={moveFocus}
      className="flex gap-1 rounded-[10px] bg-(--color-bg-subtle) p-1"
    >
      {TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            id={chatTabId(tab.value)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={CHAT_TAB_PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-[7px] text-[13px] leading-[1.45] focus-visible:outline-2 focus-visible:outline-(--color-border-brand) ${
              selected
                ? 'bg-(--color-bg-surface) font-semibold text-(--color-bg-brand) shadow-[0_1px_3px_rgba(31,28,51,0.08)]'
                : 'font-medium text-(--color-text-secondary)'
            }`}
          >
            {tab.label}
            {tab.value === 'friends' && requestCount > 0 && (
              <Badge tone="solid" aria-label={`받은 친구 요청 ${requestCount}개`}>
                {requestCount > 99 ? '99+' : requestCount}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
