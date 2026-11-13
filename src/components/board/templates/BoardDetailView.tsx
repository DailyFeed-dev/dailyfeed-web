'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getCurrentUser } from '@/services/authService';
import { getPost, getPostAuthor } from '@/services/postService';
import { getCategoryLabel } from '../boardCategories';
import BoardDetailTopBar from '../organisms/BoardDetailTopBar';
import BoardDetailSkeleton from './BoardDetailSkeleton';
import BoardLoadError from './BoardLoadError';
import BoardNotFound from './BoardNotFound';
import BoardCommentSection from './BoardCommentSection';
import BoardDetailPost from './BoardDetailPost';

// 게시글 상세 — 글을 가져와 상단 바, 본문, 댓글을 보여 줍니다.
// 댓글은 BoardCommentSection 이 API 로 가져옵니다.
export default function BoardDetailView({ postId }: { postId: number }) {
  // "다시 시도"를 누를 때마다 올려서 글을 다시 불러옵니다.
  const [attempt, setAttempt] = useState(0);
  const {
    data: post,
    error,
    loading,
  } = useApiData(`post:${postId}:${attempt}`, (signal) => getPost(postId, signal));

  // 로그인하지 않았으면 이 요청이 401 로 실패합니다. 그 경우 글과 댓글은 읽을 수만 있습니다.
  const me = useApiData('me', (signal) => getCurrentUser(signal));
  const meId = me.data?.id;

  if (loading || me.loading) return <BoardDetailSkeleton />;
  // 없는 글(404)은 404 화면을 보여 줍니다.
  if (error instanceof ApiError && error.status === 404) return <BoardNotFound />;
  // 그 밖의 오류는 "글을 불러오지 못했어요" 화면과 다시 시도 버튼을 보여 줍니다.
  if (error !== undefined || !post)
    return <BoardLoadError onRetry={() => setAttempt((n) => n + 1)} />;

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
