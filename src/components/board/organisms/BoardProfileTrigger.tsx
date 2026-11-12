'use client';

import type { ReactNode } from 'react';
import { ProfilePopoverTrigger } from '@/components/common/ProfilePopover';
import type { Schemas } from '@/lib/api';
import BoardFriendAction from './BoardFriendAction';

// 작성자(글 · 댓글)를 누르면 프로필 팝오버를 엽니다. 친구 버튼과 채팅 버튼이 들어 있고, 내 것이면 열리지 않습니다.
export default function BoardProfileTrigger({
  author,
  isMe = false,
  triggerClassName,
  openClassName,
  children,
}: {
  author: Schemas['AuthorResponse'];
  /** 내가 쓴 글·댓글이면 팝오버를 열지 않습니다. (나와 채팅하거나 친구 맺을 일이 없어서) */
  isMe?: boolean;
  triggerClassName?: string;
  openClassName?: string;
  children: ReactNode;
}) {
  const hasId = author.id !== undefined;
  return (
    <ProfilePopoverTrigger
      disabled={isMe}
      profile={author}
      actions={hasId ? <BoardFriendAction userId={author.id!} name={author.name} /> : undefined}
      chatHref={hasId ? `/chat?with=${author.id}` : '/chat'}
      triggerClassName={triggerClassName}
      openClassName={openClassName}
    >
      {children}
    </ProfilePopoverTrigger>
  );
}
