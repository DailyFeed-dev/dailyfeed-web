'use client';

import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getCurrentUser } from '@/services/authService';
import { getPost, getPostAuthor } from '@/services/postService';
import { getCategoryLabel } from '../boardCategories';
import BoardDetailTopBar from '../organisms/BoardDetailTopBar';
import BoardCommentSection from './BoardCommentSection';
import BoardDetailPost from './BoardDetailPost';

// 게시글 상세 — 글을 가져와 상단 바, 본문, 댓글을 보여 줍니다.
// 댓글은 BoardCommentSection 이 API 로 가져옵니다.
export default function BoardDetailView({ postId }: { postId: number }) {
  const {
    data: post,
    error,
    loading,
  } = useApiData(`post:${postId}`, (signal) => getPost(postId, signal));

  // 로그인하지 않았으면 이 요청이 401 로 실패합니다. 그 경우 글과 댓글은 읽을 수만 있습니다.
  const me = useApiData('me', (signal) => getCurrentUser(signal));
  const meId = me.data?.id;

  if (loading || me.loading) return <Message>글을 불러오는 중이에요.</Message>;
  if (error !== undefined || !post) {
    return (
      <>
        <BoardDetailTopBar />
        <Message>
          {error instanceof ApiError && error.status === 404
            ? '글을 찾을 수 없어요.'
            : '글을 불러오지 못했어요.'}
        </Message>
      </>
    );
  }

  const authorId = getPostAuthor(post).id;
  const isMine = meId !== undefined && authorId === meId;

  return (
    <>
      <BoardDetailTopBar category={post.category ? getCategoryLabel(post.category) : undefined} />
      <BoardDetailPost post={post} isMe={isMine} />
      <BoardCommentSection postId={postId} postAuthorId={authorId} currentUser={me.data ?? null} />
    </>
  );
}

function Message({ children }: { children: React.ReactNode }) {
  return <p className="py-24 text-center text-sm text-[#74717F]">{children}</p>;
}
