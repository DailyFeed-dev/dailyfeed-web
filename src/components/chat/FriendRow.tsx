import type { ReactNode } from 'react';

import type { ChatUser } from '@/types/chat';

import ChatAvatar from './ChatAvatar';
import { UNKNOWN_USER_NAME } from './useChatPeer';

type FriendRowProps = {
  user: ChatUser;
  subtitle?: string;
  children: ReactNode;
};

export default function FriendRow({ user, subtitle, children }: FriendRowProps) {
  const name = user.name || UNKNOWN_USER_NAME;

  return (
    <div className="flex h-[68px] items-center gap-3 rounded-xl p-3">
      <ChatAvatar name={name} src={user.avatarUrl} size={44} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]">
        <p className="truncate text-[15px] font-semibold text-(--color-text-primary)">{name}</p>
        {subtitle && (
          <p className="truncate text-[13px] text-(--color-text-secondary)">{subtitle}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">{children}</div>
    </div>
  );
}
