'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Badge from '@/components/common/Badge';
import { hasTilLoginToken } from '@/services/tilService';
import type { Schemas } from '@/lib/api';

import TilAvatar from './TilAvatar';
import { TilIcon } from './TilTempUi';
import { formatTilDate, tilDetailHref, tilExcerpt, tilLoginHref } from './tilBoardUrl';

/**
 * 게시판 목록 카드. 카드 전체가 상세 페이지 링크입니다. (디자인: TIL Post Card 67:7247)
 * 로그인하지 않았으면 상세 대신 로그인 페이지로 보냅니다.
 */
export default function TilPostCard({ til }: { til: Schemas['TilResponse'] }) {
  const likeCount = til.likeCount ?? 0;
  const commentCount = til.commentCount ?? 0;
  const router = useRouter();

  return (
    <Link
      href={tilDetailHref(til.id)}
      onClick={(e) => {
        if (hasTilLoginToken()) return;
        e.preventDefault();
        router.push(tilLoginHref(tilDetailHref(til.id)));
      }}
      className="flex w-full flex-col gap-3 rounded-xl border border-[#e2defd] bg-white px-6 py-5 transition-[border-color,box-shadow] hover:border-[#c9c3fa] hover:shadow-[0_6px_20px_rgba(104,92,240,0.08)]"
    >
      <div className="flex items-center gap-2 leading-[1.4]">
        <Badge tone="brand">{formatTilDate(til.createdAt)}</Badge>
        <TilIcon
          name="bookmark"
          className={`ml-auto ${til.bookmarkedByMe ? 'fill-[#685cf0] text-[#685cf0]' : 'text-[#9a99a8]'}`}
        />
        {til.bookmarkedByMe && <span className="sr-only">북마크한 글</span>}
      </div>

      <h2 className="text-lg leading-[1.4] font-semibold text-[#1f1d2b]">{til.title}</h2>
      <p className="truncate text-sm leading-[1.6] text-[#6b6a7b]">{tilExcerpt(til.body)}</p>

      <hr className="border-t border-[#f0eff5]" />

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm leading-[1.4] text-[#1f1d2b]">
          <TilAvatar
            name={til.author?.name}
            src={til.author?.avatarUrl}
            size={28}
            background="#c9c3fa"
          />
          {til.author?.name}
        </span>
        <span className="inline-flex items-center gap-4 text-sm leading-[1.4] font-medium text-[#6b6a7b]">
          <span className="inline-flex items-center gap-1" aria-label={`좋아요 ${likeCount}개`}>
            <TilIcon
              name="likes"
              className={til.likedByMe ? 'fill-[#685cf0] text-[#685cf0]' : ''}
            />
            {likeCount}
          </span>
          <span className="inline-flex items-center gap-1" aria-label={`댓글 ${commentCount}개`}>
            <TilIcon name="comments" />
            {commentCount}
          </span>
        </span>
      </div>
    </Link>
  );
}
