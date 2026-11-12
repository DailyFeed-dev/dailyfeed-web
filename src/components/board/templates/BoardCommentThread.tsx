'use client';

import { useState, type FormEvent } from 'react';
import Modal from '@/components/common/Modal';
import { ApiError } from '@/lib/api';
import {
  createComment,
  deleteComment,
  toggleCommentLike,
  type Comment,
} from '@/services/commentService';
import BoardCommentItem from '../organisms/BoardCommentItem';

function toMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.status === 401 ? '로그인이 필요해요.' : error.message;
  return fallback;
}

// 댓글 입력창과 목록 — 작성, 삭제, 좋아요를 요청하고 화면 목록에 바로 반영합니다.
// initialComments 는 처음 한 번만 쓰고 이후에는 이 컴포넌트가 목록을 들고 있습니다.
export default function BoardCommentThread({
  postId,
  initialComments,
  meId,
}: {
  postId: number;
  initialComments: Comment[];
  /** 로그인한 사용자 id. 로그인하지 않았으면 undefined */
  meId?: number;
}) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyIds, setBusyIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  // 삭제 확인 모달이 가리키는 댓글 id. null 이면 모달이 닫혀 있습니다.
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = content.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await createComment(postId, text);
      setComments((prev) => [...prev, created]);
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
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white p-4"
      >
        <textarea
          aria-label="댓글 입력"
          rows={2}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="댓글을 입력해 주세요."
          className="w-full resize-none bg-transparent text-sm leading-[1.6] text-[#2E2D3A] outline-none placeholder:text-[#74717F]"
        />
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="rounded-full bg-indigo-600 px-4 py-1.5 text-[13px] leading-normal font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '등록 중…' : '댓글 작성'}
          </button>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-xs leading-[1.55] text-[#D41717]">
          {error}
        </p>
      )}

      {comments.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#74717F]">
          아직 댓글이 없어요. 첫 댓글을 남겨 보세요.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-6">
          {comments.map((comment, index) => {
            const id = comment.id;
            return (
              <BoardCommentItem
                key={id ?? index}
                comment={comment}
                isMine={meId !== undefined && comment.author?.id === meId}
                busy={id !== undefined && busyIds.includes(id)}
                onToggleLike={() => id !== undefined && handleToggleLike(id)}
                onDelete={() => id !== undefined && setDeleteTargetId(id)}
              />
            );
          })}
        </ul>
      )}

      <Modal
        open={deleteTargetId !== null}
        title="댓글을 삭제할까요?"
        body="삭제한 댓글은 되돌릴 수 없어요."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={() => deleteTargetId !== null && handleDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
