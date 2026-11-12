'use client';

import FriendButton from '@/components/common/FriendButton';
import { useFriendRelation } from '@/hooks/useFriendRelation';

/**
 * 프로필 팝오버의 친구 버튼 (디자인: Profile Popover 599:2983 의 Friend=No / Friend=Yes)
 * 게시판과 함께 쓰려고 화면은 common/FriendButton, 동작은 hooks/useFriendRelation 으로 옮겼습니다.
 * 동작(친구 추가 · 요청 취소 · 수락 · 친구 끊기)은 그대로입니다.
 */
export default function TilFriendButton({ userId, name = '' }: { userId: number; name?: string }) {
  const friend = useFriendRelation(userId, name);
  return <FriendButton {...friend} />;
}
