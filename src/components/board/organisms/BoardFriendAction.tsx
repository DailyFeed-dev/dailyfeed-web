'use client';

import FriendButton from '@/components/common/FriendButton';
import { useFriendRelation } from '@/hooks/useFriendRelation';

// 프로필 팝오버의 친구 버튼 — 관계 조회·요청 동작(useFriendRelation)과 화면(FriendButton)을 이어 줍니다.
export default function BoardFriendAction({ userId, name }: { userId: number; name?: string }) {
  const friend = useFriendRelation(userId, name);
  return <FriendButton {...friend} />;
}
