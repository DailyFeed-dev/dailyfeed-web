import { Heart } from 'lucide-react';
import type { Comment } from '@/services/commentService';
import { formatDateTime } from '../boardFormat';

// 댓글 한 개 — 작성자(내 댓글이면 표시), 내용, 좋아요, 삭제(내 댓글만)
export default function BoardCommentItem({
  comment,
  isMine,
  busy,
  onToggleLike,
  onDelete,
}: {
  comment: Comment;
  isMine: boolean;
  /** 좋아요·삭제 요청 중이면 버튼을 막습니다. */
  busy: boolean;
  onToggleLike: () => void;
  onDelete: () => void;
}) {
  const name = comment.author?.name ?? '';
  const liked = comment.likedByMe === true;

  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600"
      >
        {name.slice(0, 1)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] leading-[1.55] font-semibold text-[#201D2B]">{name}</span>
          {isMine && (
            <span className="rounded-full bg-indigo-50 px-1.5 py-px text-[11px] leading-normal font-medium text-indigo-600">
              내 댓글
            </span>
          )}
          <span className="text-xs leading-normal text-[#74717F]">
            {formatDateTime(comment.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-[15px] leading-[1.7] whitespace-pre-wrap text-[#2E2D3A]">
          {comment.content}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-xs leading-normal text-[#74717F]">
          <button
            type="button"
            aria-pressed={liked}
            disabled={busy}
            onClick={onToggleLike}
            className={`inline-flex items-center gap-1 disabled:opacity-60 ${
              liked ? 'font-semibold text-indigo-600' : 'hover:text-[#201D2B]'
            }`}
          >
            <Heart aria-hidden="true" className={`size-3.5 ${liked ? 'fill-current' : ''}`} />
            {comment.likeCount ?? 0}
          </button>
          {isMine && (
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className="hover:text-[#D41717] disabled:opacity-60"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
