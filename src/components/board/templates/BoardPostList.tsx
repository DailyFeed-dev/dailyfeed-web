'use client';

import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getPosts } from '@/services/postService';
import type { BoardCategory } from '../boardCategories';
import BoardPagination from '../organisms/BoardPagination';
import BoardPostHeader from '../organisms/BoardPostHeader';
import BoardPostRow from '../molecules/BoardPostRow';
import BoardPostRowSkeleton from '../molecules/BoardPostRowSkeleton';

// 불러오는 동안 보여 줄 자리 표시 줄 수
const SKELETON_ROWS = 10;

// 글 메인 (게시글 목록)
// category 가 없으면 전체 글을 가져옵니다. 한 번에 20개씩 보여 주고, 페이지는 주소의 ?page= 로 옮깁니다. (주소는 1부터, API 는 0부터)
export default function BoardPostList({
  category,
  page,
}: {
  category?: BoardCategory;
  page: number;
}) {
  const { data, error, loading } = useApiData(`posts:${category ?? 'ALL'}:${page}`, (signal) =>
    getPosts({ page: page - 1, size: 20, category }, signal),
  );
  const posts = data?.items ?? [];

  return (
    <section aria-label="게시글 목록">
      <div className="overflow-hidden rounded-t-lg">
        <BoardPostHeader />
        {loading && (
          <div role="status" aria-label="글을 불러오는 중" className="animate-pulse">
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <BoardPostRowSkeleton key={index} />
            ))}
          </div>
        )}
        {!loading && error !== undefined && (
          <ListMessage>
            {error instanceof ApiError ? error.message : '글을 불러오지 못했어요.'}
          </ListMessage>
        )}
        {!loading && error === undefined && posts.length === 0 && (
          <ListMessage>아직 등록된 글이 없어요.</ListMessage>
        )}
        {posts.map((post) => (
          <BoardPostRow key={post.id} post={post} />
        ))}
      </div>
      <BoardPagination page={page} hasNext={data?.hasNext ?? false} category={category} />
    </section>
  );
}

function ListMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b border-zinc-200 px-6 py-16 text-center text-sm text-[#6C6980]">
      {children}
    </p>
  );
}
