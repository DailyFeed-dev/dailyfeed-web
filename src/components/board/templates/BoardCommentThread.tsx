'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import Modal from '@/components/common/Modal';
import { ApiError, type Schemas } from '@/lib/api';
import {
  createComment,
  deleteComment,
  toggleCommentLike,
  type Comment,
} from '@/services/commentService';
import BoardCommentItem from '../organisms/BoardCommentItem';

const MAX_LENGTH = 500;
const PAGE_SIZE = 3;

type Sort = 'latest' | 'popular';

const timeOf = (iso?: string) => (iso ? new Date(iso).getTime() : 0);

function toMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.status === 401 ? '로그인이 필요해요.' : error.message;
  return fallback;
}

const textareaClass =
  'w-full min-h-13 resize-none bg-transparent text-[15px] leading-[1.7] text-[#2e2d3a] outline-none field-sizing-content placeholder:text-[#a9a8b6]';

// 댓글 제목(댓글 수 · 정렬), 입력창, 목록 — TIL 댓글(Comments 127:4520)과 같은 구성입니다.
// 작성, 삭제, 좋아요를 요청하고 화면 목록에 바로 반영합니다. 글만 쓸 수 있습니다. (답글 X)
// initialComments 는 처음 한 번만 쓰고 이후에는 이 컴포넌트가 목록을 들고 있습니다.
export default function BoardCommentThread({
  postId,
  postAuthorId,
  currentUser,
  initialComments,
}: {
  postId: number;
  postAuthorId?: number;
  /** 로그인하지 않았으면 null (입력창 대신 로그인 안내) */
  currentUser: Schemas['AuthorResponse'] | null;
  initialComments: Comment[];
}) {
  const meId = currentUser?.id;
  const [comments, setComments] = useState(initialComments);
  const [sort, setSort] = useState<Sort>('latest');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyIds, setBusyIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  // 삭제 확인 모달이 가리키는 댓글 id. null 이면 모달이 닫혀 있습니다.
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const sorted = useMemo(
    () =>
      [...comments].sort((a, b) =>
        sort === 'popular'
          ? (b.likeCount ?? 0) - (a.likeCount ?? 0)
          : timeOf(b.createdAt) - timeOf(a.createdAt),
      ),
    [comments, sort],
  );

  async function handleSubmit() {
    const text = content.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await createComment(postId, text);
      setComments((prev) => [...prev, created]);
      setVisible((n) => n + 1); // 보고 있던 댓글이 밀려 사라지지 않게
      setContent('');
    } catch (e) {
      setError(toMessage(e, '댓글을 등록하지 못했어요. 잠시 후 다시 시도해 주세요.'));
    } finally {
      setSubmitting(false);
    }
  }

  // 요청 중인 댓글은 버튼을 막아 같은 요청이 겹치지 않게 합니다.
  async function runOn(commentId: number, task: () => Promise<void>, fallback: string) {
    if (busyIds.includes(commentId)) return;
    setBusyIds((prev) => [...prev, commentId]);
    setError(null);
    try {
      await task();
    } catch (e) {
      setError(toMessage(e, fallback));
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== commentId));
    }
  }

  function handleToggleLike(commentId: number) {
    return runOn(
      commentId,
      async () => {
        const result = await toggleCommentLike(postId, commentId);
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, likedByMe: result.liked, likeCount: result.likeCount } : c,
          ),
        );
      },
      '좋아요를 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
  }

  // 모달에서 삭제를 확인하면 모달을 닫고 삭제 요청을 보냅니다.
  function handleDelete(commentId: number) {
    setDeleteTargetId(null);
    return runOn(
      commentId,
      async () => {
        await deleteComment(postId, commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      },
      '댓글을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
  }

  return (
    <>
      <div className="flex items-center justify-between pb-4 leading-[1.4]">
        <h2 className="text-xl font-bold text-[#1f1d2b]">
          댓글 <span className="ml-0.5 text-[#685cf0]">{comments.length}</span>
        </h2>
        <div role="radiogroup" aria-label="정렬" className="flex gap-3">
          {(['latest', 'popular'] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={sort === s}
              onClick={() => setSort(s)}
              className={`cursor-pointer text-[13px] leading-[1.4] ${
                sort === s ? 'font-semibold text-[#1f1d2b]' : 'font-medium text-[#9a99a8]'
              }`}
            >
              {s === 'latest' ? '최신순' : '인기순'}
            </button>
          ))}
        </div>
      </div>

      {/* 댓글 입력 (로그인해야 쓸 수 있어요) */}
      {currentUser ? (
        <div className="flex items-start gap-3.5 pb-3">
          <Avatar name={currentUser.name} src={currentUser.avatarUrl} size={36} color="#1f1d2b" />
          <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border-[1.5px] border-[#e2defd] bg-white pt-4 pr-3 pb-3 pl-4.5 transition-[border-color,box-shadow] focus-within:border-[#685cf0] focus-within:shadow-[0_0_0_4px_rgba(105,92,240,0.12)]">
            <textarea
              value={content}
              maxLength={MAX_LENGTH}
              placeholder="이 글에 대한 생각이나 질문을 남겨주세요"
              aria-label="댓글 입력"
              onChange={(event) => setContent(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') void handleSubmit();
              }}
              className={textareaClass}
            />
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs leading-[1.4] font-medium text-[#9a99a8]">
                {content.length} / {MAX_LENGTH}
              </span>
              <Button
                size="md"
                onClick={() => void handleSubmit()}
                disabled={!content.trim() || submitting}
              >
                {submitting ? '등록 중…' : '댓글 작성'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mb-3 rounded-xl border-[1.5px] border-[#e2defd] bg-white px-4.5 py-4 text-[15px] text-[#6b6a7b]">
          댓글을 쓰려면 {/* 로그인 후 이 글로 돌아오도록 ?next= 를 붙입니다. */}
          <Link
            href={`/login?next=${encodeURIComponent(`/board/${postId}`)}`}
            className="font-semibold text-[#4b3fd6] underline underline-offset-2"
          >
            로그인
          </Link>
          해 주세요.
        </p>
      )}

      {error && (
        <p role="alert" className="mb-3 text-xs leading-[1.55] text-[#D41717]">
          {error}
        </p>
      )}

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#9a99a8]">첫 댓글을 남겨 보세요.</p>
      ) : (
        sorted.slice(0, visible).map((comment, index) => {
          const id = comment.id;
          return (
            <BoardCommentItem
              key={id ?? index}
              comment={comment}
              isMine={meId !== undefined && comment.author?.id === meId}
              isPostAuthor={postAuthorId !== undefined && comment.author?.id === postAuthorId}
              busy={id !== undefined && busyIds.includes(id)}
              onToggleLike={() => id !== undefined && void handleToggleLike(id)}
              onDelete={() => id !== undefined && setDeleteTargetId(id)}
            />
          );
        })
      )}

      {sorted.length > visible && (
        <div className="flex justify-center pt-5">
          <Button variant="outline" size="md" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
            댓글 더보기
            <Icon name="chevron-down" size={16} />
          </Button>
        </div>
      )}

      <Modal
        open={deleteTargetId !== null}
        title="댓글을 삭제할까요?"
        body="삭제한 댓글은 되돌릴 수 없어요."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={() => deleteTargetId !== null && void handleDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
