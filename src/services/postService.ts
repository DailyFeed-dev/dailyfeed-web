import { api, type Schemas } from '@/lib/api';

// 피드 글 API (/api/v1/posts) 호출 함수 모음입니다.
// 컴포넌트에서는 api 를 직접 부르지 않고 이 함수들을 씁니다.

// ⚠️ schema.d.ts 가 아직 최신이 아니라서 새로 생긴 필드(category, tags, likeCount, viewCount)를 여기서 보충합니다.
//    `npm run api:types` 로 타입을 다시 만든 뒤에는 Schemas['PostResponse'] 만 쓰면 됩니다.
export type Post = Schemas['PostResponse'] & {
  category?: string | null;
  tags?: string[];
  likeCount?: number;
  viewCount?: number;
};

export type PostPage = {
  items: Post[];
  page: number;
  size: number;
  hasNext: boolean;
};

export type GetPostsParams = {
  /** 0부터 시작합니다. (기본 0) */
  page?: number;
  /** 한 번에 가져올 개수. (기본 20) */
  size?: number;
  /** FREE | QUESTION | INFO | REVIEW. 생략하면 전체 */
  category?: string;
};

/** 피드 글 목록 (최신순) */
export function getPosts({ page, size, category }: GetPostsParams = {}, signal?: AbortSignal) {
  return api.get<PostPage>('/api/v1/posts', { query: { page, size, category }, signal });
}

/** 피드 글 상세. 상세를 조회하면 조회수가 1 올라갑니다. */
export function getPost(postId: number, signal?: AbortSignal) {
  return api.get<Post>(`/api/v1/posts/${postId}`, { signal });
}

/** 글 작성 요청. title·category·tags 는 선택, content 는 필수, 태그는 최대 5개 */
export type CreatePostBody = Schemas['CreatePostRequest'];

/** 피드 글 작성. 로그인한 사용자의 토큰이 필요하고, 만들어진 글을 돌려줍니다. */
export function createPost(body: CreatePostBody, signal?: AbortSignal) {
  return api.post<Post>('/api/v1/posts', body, { signal });
}
