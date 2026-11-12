import Link from 'next/link';
import type { Post } from '@/services/postService';
import BoardCategoryBadge from '../atoms/BoardCategoryBadge';
import { formatDate } from '../boardFormat';

// 게시글 목록의 한 줄입니다. 머리글(BoardPostList)과 같은 칸 구성을 씁니다.
// 줄 전체를 누르면 해당 게시글 상세(/board/[id])로 이동합니다.
export const POST_GRID = 'grid grid-cols-[91px_1fr_112px_136px_84px_84px] items-center';

export default function BoardPostRow({ post }: { post: Post }) {
  return (
    <Link
      href={`/board/${post.id}`}
      className={`${POST_GRID} h-17 border-b border-zinc-200 transition-colors hover:bg-indigo-50`}
    >
      {/* 카테고리가 없는 글은 "없음" 배지를 보여 줍니다. */}
      <BoardCategoryBadge code={post.category} className="justify-self-center" />
      <div className="min-w-0">
        <p className="truncate text-sm leading-normal font-semibold text-[#1F1D2B]">{post.title}</p>
        <p className="truncate text-xs leading-normal text-[#6C6980]">
          {post.tags?.map((tag) => `#${tag}`).join(' · ')}
        </p>
      </div>
      <span className="text-center text-[13px] leading-normal text-[#6C6980]">
        {post.authorName}
      </span>
      <span className="text-center text-[13px] leading-normal text-[#6C6980]">
        {formatDate(post.createdAt)}
      </span>
      <span className="text-center text-[13px] leading-normal text-[#6C6980]">
        {post.viewCount ?? 0}
      </span>
      <span className="text-center text-[13px] leading-normal text-[#6C6980]">
        {/* 댓글 수는 아직 API 에 없어서 반응(좋아요)만 보여 줍니다. */}
        {post.likeCount ?? 0}
      </span>
    </Link>
  );
}
