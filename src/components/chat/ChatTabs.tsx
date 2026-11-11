import Badge from '@/components/common/Badge';

export type ChatTab = 'chats' | 'friends';

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
  return (
    <div role="tablist" className="flex gap-1 rounded-[10px] bg-(--color-bg-subtle) p-1">
      {TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-[7px] text-[13px] leading-[1.45] ${
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
