'use client';

import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getPost } from '@/services/postService';
import { getCategoryLabel } from '../boardCategories';
import BoardDetailTopBar from '../organisms/BoardDetailTopBar';
import BoardCommentSection from './BoardCommentSection';
import BoardDetailPost from './BoardDetailPost';

// 게시글 상세 — 글을 가져와 상단 바, 본문, 댓글을 보여 줍니다.
// 댓글은 아직 임시 데이터입니다.
export default function BoardDetailView({ postId }: { postId: number }) {
  const {
    data: post,
    error,
    loading,
  } = useApiData(`post:${postId}`, (signal) => getPost(postId, signal));

  if (loading) return <Message>글을 불러오는 중이에요.</Message>;
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

  return (
    <>
      <BoardDetailTopBar category={post.category ? getCategoryLabel(post.category) : undefined} />
      <BoardDetailPost post={post} />
      <BoardCommentSection />
    </>
  );
}

function Message({ children }: { children: React.ReactNode }) {
  return <p className="py-24 text-center text-sm text-[#74717F]">{children}</p>;
}
