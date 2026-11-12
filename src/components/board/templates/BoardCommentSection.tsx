'use client';

import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getCurrentUser } from '@/services/authService';
import { getComments } from '@/services/commentService';
import BoardCommentThread from './BoardCommentThread';

// 댓글 영역 — 제목, 입력창, 목록. 댓글과 내 정보를 가져온 뒤 BoardCommentThread 가 보여 줍니다.
export default function BoardCommentSection({ postId }: { postId: number }) {
  const comments = useApiData(`comments:${postId}`, (signal) => getComments(postId, signal));
  // 로그인하지 않았으면 이 요청이 401 로 실패합니다. 그 경우 댓글은 읽을 수만 있습니다.
  const me = useApiData('me', (signal) => getCurrentUser(signal));
  const loading = comments.loading || me.loading;

  return (
    <section aria-label="댓글" className="mt-10">
      <h2 className="text-base leading-normal font-semibold text-[#201D2B]">댓글</h2>

      {loading && (
        <div role="status" aria-label="댓글을 불러오는 중" className="mt-4 animate-pulse">
          <div className="h-[88px] rounded-2xl bg-zinc-100" />
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

      {!loading && comments.error !== undefined && (
        <p className="py-10 text-center text-sm text-[#74717F]">
          {comments.error instanceof ApiError
            ? comments.error.message
            : '댓글을 불러오지 못했어요.'}
        </p>
      )}

      {!loading && comments.error === undefined && (
        <BoardCommentThread
          key={postId}
          postId={postId}
          initialComments={comments.data ?? []}
          meId={me.data?.id}
        />
      )}
    </section>
  );
}
