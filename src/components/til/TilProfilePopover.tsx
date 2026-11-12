'use client';

import type { ComponentProps } from 'react';

import { ProfilePopover, ProfilePopoverTrigger } from '@/components/common/ProfilePopover';

import TilFriendButton from './TilFriendButton';

// 프로필 팝오버는 게시판과 함께 쓰려고 common/ProfilePopover 로 옮겼습니다.
// TIL 은 기존처럼 userId 를 넘기면 친구 버튼이 붙습니다.

type WithUserId<P> = Omit<P, 'actions'> & {
  /** 프로필 주인의 userId. 있으면 친구 버튼(친구 추가 · 친구 등)을 보여줍니다. */
  userId?: number;
};

function friendButton(userId: number | undefined, name: string | undefined) {
  return userId !== undefined ? <TilFriendButton userId={userId} name={name} /> : undefined;
}

/** 작성자 · 댓글 작성자의 간단 프로필. (디자인: Profile Popover 599:2983) */
export function TilProfilePopover({
  userId,
  ...props
}: WithUserId<ComponentProps<typeof ProfilePopover>>) {
  return <ProfilePopover {...props} actions={friendButton(userId, props.profile.name)} />;
}

/** 트리거를 누르면 바로 아래에 프로필 팝오버를 띄웁니다. */
export function TilProfilePopoverTrigger({
  userId,
  ...props
}: WithUserId<ComponentProps<typeof ProfilePopoverTrigger>>) {
  return <ProfilePopoverTrigger {...props} actions={friendButton(userId, props.profile.name)} />;
}
