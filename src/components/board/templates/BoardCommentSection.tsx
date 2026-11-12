'use client';

import type { Schemas } from '@/lib/api';
import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getComments } from '@/services/commentService';
import BoardCommentThread from './BoardCommentThread';

// 댓글 영역 — 댓글을 가져온 뒤 BoardCommentThread 가 제목, 입력창, 목록을 보여 줍니다.
export default function BoardCommentSection({
  postId,
  postAuthorId,
  currentUser,
}: {
  postId: number;
  /** 글쓴이 id — 글쓴이가 단 댓글에 "작성자" 배지를 붙입니다. */
  postAuthorId?: number;
  /** 로그인한 사용자. 로그인하지 않았으면 null (입력창 대신 로그인 안내) */
  currentUser: Schemas['AuthorResponse'] | null;
}) {
  const comments = useApiData(`comments:${postId}`, (signal) => getComments(postId, signal));

  return (
    <section aria-label="댓글" className="mt-10">
      {comments.loading && (
        <div role="status" aria-label="댓글을 불러오는 중" className="animate-pulse">
          <div className="h-7 w-24 rounded bg-zinc-100" />
          <div className="mt-4 h-[88px] rounded-2xl bg-zinc-100" />
          <div className="mt-6 flex flex-col gap-6">
            {[0, 1].map((index) => (
              <div key={index} className="flex gap-3">
                <span className="size-9 shrink-0 rounded-full bg-zinc-200" />
                <div className="flex flex-1 flex-col gap-2 pt-1">
                  <span className="h-3 w-24 rounded bg-zinc-200" />
                  <span className="h-3.5 w-3/4 rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!comments.loading && comments.error !== undefined && (
        <p className="py-10 text-center text-sm text-[#74717F]">
          {comments.error instanceof ApiError
            ? comments.error.message
            : '댓글을 불러오지 못했어요.'}
        </p>
      )}

      {!comments.loading && comments.error === undefined && (
        <BoardCommentThread
          key={postId}
          postId={postId}
          postAuthorId={postAuthorId}
          currentUser={currentUser}
          initialComments={comments.data ?? []}
        />
      )}
    </section>
  );
}
