'use client';

import type { Schemas } from '@/lib/api';
import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getComments } from '@/services/commentService';
import BoardCommentSkeleton from '../organisms/BoardCommentSkeleton';
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
      {comments.loading && <BoardCommentSkeleton />}

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
