'use client';

import type { Schemas } from '@/lib/api';

import TilAvatar from './TilAvatar';
import { TilProfilePopoverTrigger } from './TilProfilePopover';
import { tilChatHref } from './tilBoardUrl';

/** 글 머리의 작성자. 누르면 프로필 팝오버가 열립니다. (디자인: 136:4964) */
export function TilAuthorTrigger({
  author,
  dateLabel,
}: {
  author: Schemas['AuthorResponse'];
  dateLabel: string;
}) {
  return (
    <TilProfilePopoverTrigger
      profile={author}
      chatHref={tilChatHref(author.id)}
      triggerClassName="-my-1 -ml-1.5 gap-3 rounded-[10px] py-1 pr-3 pl-1.5 transition-colors hover:bg-[#f0eefe]/60"
      openClassName="bg-[#f0eefe] hover:bg-[#f0eefe]"
    >
      <TilAvatar name={author.name} src={author.avatarUrl} size={40} color="#1f1d2b" />
      <span className="flex flex-col gap-0.5 leading-[1.4]">
        <span className="text-[15px] font-semibold text-[#1f1d2b]">{author.name}</span>
        <span className="text-[13px] text-[#9a99a8]">{dateLabel}</span>
      </span>
    </TilProfilePopoverTrigger>
  );
}

/**
 * 본문 아래 작성자 카드 (디자인: Author Card 136:5061)
 * API 에 소개 · 기록 수 · 팔로우가 없어 아바타와 이름만 보여줍니다.
 */
export function TilAuthorCard({ author }: { author: Schemas['AuthorResponse'] }) {
  return (
    <section
      aria-label="작성자"
      className="flex items-center gap-4 rounded-2xl border border-[#e2defd] bg-white p-6"
    >
      <TilProfilePopoverTrigger
        profile={author}
        chatHref={tilChatHref(author.id)}
        triggerClassName="rounded-full"
      >
        <TilAvatar name={author.name} src={author.avatarUrl} size={64} color="#1f1d2b" />
      </TilProfilePopoverTrigger>
      <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[1.4]">
        <span className="text-xs font-medium text-[#9a99a8]">작성자</span>
        <span className="text-lg font-bold text-[#1f1d2b]">{author.name}</span>
      </div>
    </section>
  );
}
