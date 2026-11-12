'use client';

import Avatar from '@/components/common/Avatar';
import type { Schemas } from '@/lib/api';
import BoardProfileTrigger from './BoardProfileTrigger';

// 본문 아래 작성자 카드 (TIL Author Card 136:5061 과 같은 모양)
// API 에 소개 · 기록 수 · 팔로우가 없어 아바타와 이름만 보여 줍니다. 아바타를 누르면 프로필 팝오버가 열립니다.
export default function BoardAuthorCard({
  author,
  isMe = false,
}: {
  author: Schemas['AuthorResponse'];
  isMe?: boolean;
}) {
  return (
    <section
      aria-label="작성자"
      className="mt-10 flex items-center gap-4 rounded-2xl border border-[#e2defd] bg-white p-6"
    >
      <BoardProfileTrigger author={author} isMe={isMe} triggerClassName="rounded-full">
        <Avatar name={author.name} src={author.avatarUrl} size={64} color="#1f1d2b" />
      </BoardProfileTrigger>
      <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[1.4]">
        <span className="text-xs font-medium text-[#9a99a8]">작성자</span>
        <span className="text-lg font-bold text-[#1f1d2b]">{author.name}</span>
      </div>
    </section>
  );
}
