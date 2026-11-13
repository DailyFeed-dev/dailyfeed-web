'use client';

import { useState } from 'react';
import { ApiError } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { getPostAuthor, getPosts } from '@/services/postService';
import type { BoardCategory } from '../boardCategories';
import { isUnauthorized } from '../boardLogin';
import { boardListHref } from '../boardUrl';
import BoardLoginNotice from '../molecules/BoardLoginNotice';
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

  // 가장 최근에 받은 목록을 기억해 둡니다. 탭·페이지를 옮겨 새로 불러오는 동안 이 목록을 흐리게 남겨 둡니다.
  const [lastData, setLastData] = useState(data);
  if (data && data !== lastData) setLastData(data);
  const shown = data ?? (loading ? lastData : undefined);
  // 보여 줄 이전 목록이 없을 때(처음 진입)만 스켈레톤을 씁니다.
  const refreshing = loading && shown !== undefined;

  // 제목이나 작성자가 없는 글은 보여 주지 않습니다.
  const posts = (shown?.items ?? []).filter(
    (post) => post.title?.trim() && getPostAuthor(post).name?.trim(),
  );

  return (
    <section aria-label="게시글 목록">
      <div className="overflow-hidden rounded-t-lg">
        <BoardPostHeader />
        {loading && !refreshing && (
          <div role="status" aria-label="글을 불러오는 중" className="animate-pulse">
            {Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <BoardPostRowSkeleton key={index} />
            ))}
          </div>
        )}
        {!loading && isUnauthorized(error) && (
          // 로그인하면 지금 보던 카테고리·페이지로 돌아옵니다.
          <BoardLoginNotice
            message="게시판을 보려면 로그인해 주세요."
            returnTo={boardListHref({ category, page })}
          />
        )}
        {!loading && error !== undefined && !isUnauthorized(error) && (
          <ListMessage>
            {error instanceof ApiError ? error.message : '글을 불러오지 못했어요.'}
          </ListMessage>
        )}
        {!loading && error === undefined && posts.length === 0 && (
          <ListMessage>아직 등록된 글이 없어요.</ListMessage>
        )}
        {/* 새 목록을 불러오는 동안에는 이전 목록을 흐리게 보여 줍니다. (TIL 과 같은 방식) */}
        <div
          aria-busy={refreshing}
          className={`transition-opacity ${refreshing ? 'opacity-50' : ''}`}
        >
          {posts.map((post) => (
            <BoardPostRow key={post.id} post={post} />
          ))}
        </div>
      </div>
      <BoardPagination page={page} hasNext={shown?.hasNext ?? false} category={category} />
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
