import type { ChatUser } from '@/types/chat';

import ChatAvatar from './ChatAvatar';
import ChatStateMessage from './ChatStateMessage';

type FirstChatIntroProps = {
  peer: ChatUser;
  onPickReply?: (text: string) => void;
};

const QUICK_REPLIES = ['안녕하세요! 👋', '글 잘 봤어요!', '질문이 있어요'];

export default function FirstChatIntro({ peer, onPickReply }: FirstChatIntroProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-[#fcfcfe] px-4 py-5 sm:px-6">
      <ChatStateMessage
        visual={<ChatAvatar name={peer.name} src={peer.avatarUrl} size={72} />}
        title={`${peer.name}님과의 첫 대화예요`}
        description="인사를 건네며 대화를 시작해 보세요"
      >
        {onPickReply &&
          QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => onPickReply(reply)}
              className="cursor-pointer rounded-[18px] border border-(--color-border-brand-soft) bg-(--color-bg-surface) px-3.5 py-2 text-[13px] leading-[1.45] font-medium text-(--color-text-brand) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand)"
            >
              {reply}
            </button>
          ))}
      </ChatStateMessage>
    </div>
  );
}
