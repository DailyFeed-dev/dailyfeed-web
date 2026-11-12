import { api, type Schemas } from '@/lib/api';

// 게시글 댓글 API (/api/v1/posts/{postId}/comments) 호출 함수 모음입니다.
// 컴포넌트에서는 api 를 직접 부르지 않고 이 함수들을 씁니다.

export type Comment = Schemas['CommentResponse'];
export type CommentLike = Schemas['LikeResponse'];

/** 댓글 목록 (오래된 순). likeCount 와 내가 좋아요했는지(likedByMe)가 함께 옵니다. 페이지 없이 전부 옵니다. */
export function getComments(postId: number, signal?: AbortSignal) {
  return api.get<Comment[]>(`/api/v1/posts/${postId}/comments`, { signal });
}

/** 댓글 작성. 로그인이 필요하고, 만들어진 댓글을 돌려줍니다. */
export function createComment(postId: number, content: string, signal?: AbortSignal) {
  return api.post<Comment>(`/api/v1/posts/${postId}/comments`, { content }, { signal });
}

/** 댓글 삭제. 작성자만 할 수 있습니다. */
export function deleteComment(postId: number, commentId: number, signal?: AbortSignal) {
  return api.delete<void>(`/api/v1/posts/${postId}/comments/${commentId}`, { signal });
}

/** 댓글 좋아요 토글. 안 눌렀으면 켜고, 눌렀으면 취소합니다. 바뀐 상태(liked)와 좋아요 수를 돌려줍니다. */
export function toggleCommentLike(postId: number, commentId: number, signal?: AbortSignal) {
  return api.post<CommentLike>(`/api/v1/posts/${postId}/comments/${commentId}/likes`, undefined, {
    signal,
  });
}
