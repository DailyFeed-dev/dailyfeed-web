'use client';

import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import LineIcon from '@/components/common/LineIcon';
import type { Comment } from '@/services/commentService';
import { formatRelativeTime } from '../boardFormat';
import BoardProfileTrigger from './BoardProfileTrigger';

// 댓글 한 개 (TIL 댓글과 같은 구성) — 작성자(누르면 프로필 팝오버), 시간, 내용, 좋아요, 내 댓글이면 ⋯ 메뉴(삭제)
export default function BoardCommentItem({
  comment,
  isMine,
  isPostAuthor,
  busy,
  onToggleLike,
  onDelete,
}: {
  comment: Comment;
  /** 내가 쓴 댓글이면 프로필 팝오버를 열지 않고 ⋯ 메뉴(삭제)를 보여 줍니다. */
  isMine: boolean;
  /** 글쓴이가 단 댓글이면 이름 옆에 "작성자" 배지를 붙입니다. */
  isPostAuthor: boolean;
  /** 좋아요 · 삭제 요청 중이면 버튼을 막습니다. */
  busy: boolean;
  onToggleLike: () => void;
  onDelete: () => void;
}) {
  const author = comment.author ?? {};
  const liked = comment.likedByMe === true;

  return (
    <article className="flex items-start gap-3.5 border-b border-[#ecebf2] py-5">
      <BoardProfileTrigger author={author} isMe={isMine} triggerClassName="rounded-full">
        <Avatar name={author.name} src={author.avatarUrl} size={36} color="#1f1d2b" />
      </BoardProfileTrigger>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <header className="flex items-center gap-2 leading-[1.4]">
          <BoardProfileTrigger author={author} isMe={isMine} triggerClassName="group">
            <span className="text-sm font-semibold text-[#1f1d2b] underline-offset-2 group-hover:underline">
              {author.name}
            </span>
          </BoardProfileTrigger>
          {isPostAuthor && <Badge tone="brand">작성자</Badge>}
          {isMine && <Badge tone="neutral">내 댓글</Badge>}
          <span className="text-[13px] text-[#9a99a8]">
            {formatRelativeTime(comment.createdAt)}
          </span>

          {/* 내 댓글만 메뉴(삭제)를 보여 줍니다. */}
          {isMine && (
            <details className="relative ml-auto">
              <summary
                aria-label="댓글 메뉴"
                className="inline-flex cursor-pointer list-none rounded text-[#9a99a8] hover:bg-[#f6f5fb] [&::-webkit-details-marker]:hidden"
              >
                <LineIcon name="more" />
              </summary>
              <div className="absolute top-[calc(100%+4px)] right-0 z-10 min-w-24 rounded-xl border border-[#f0eff5] bg-white p-1.5 shadow-[0_12px_32px_rgba(31,28,43,0.12)]">
                <button
                  type="button"
                  disabled={busy}
                  onClick={(event) => {
                    // 메뉴를 닫고 삭제 확인 모달을 엽니다.
                    event.currentTarget.closest('details')?.removeAttribute('open');
                    onDelete();
                  }}
                  className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-[#e5484d] hover:bg-[#fff5f5] disabled:cursor-default disabled:opacity-60"
                >
                  삭제
                </button>
              </div>
            </details>
          )}
        </header>

        <p className="text-[15px] leading-[1.7] wrap-anywhere whitespace-pre-wrap text-[#2e2d3a]">
          {comment.content}
        </p>

        <div className="flex items-center gap-4 pt-0.5 text-[13px] leading-[1.4] font-medium">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={`좋아요 ${comment.likeCount ?? 0}`}
            onClick={onToggleLike}
            disabled={busy}
            className={`inline-flex cursor-pointer items-center gap-1 disabled:cursor-default ${
              liked ? 'text-[#4b3fd6]' : 'text-[#6b6a7b] hover:text-[#1f1d2b]'
            }`}
          >
            <LineIcon
              name="heart"
              size={16}
              className={liked ? 'fill-[#685cf0] text-[#685cf0]' : ''}
            />
            <span>{comment.likeCount ?? 0}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
