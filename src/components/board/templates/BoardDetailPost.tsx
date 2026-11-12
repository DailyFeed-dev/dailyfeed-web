import type { Post } from '@/services/postService';
import { getCategoryLabel } from '../boardCategories';
import { formatDateTime } from '../boardFormat';

// 게시글 상세 카드 — 제목, 작성 정보, 본문, 태그, 반응
export default function BoardDetailPost({ post }: { post: Post }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-8">
      {post.category && (
        <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[13px] leading-[1.5] font-medium text-indigo-600">
          {getCategoryLabel(post.category)}
        </span>
      )}
      <h1 className="mt-3 text-2xl leading-8 font-bold text-[#201D2B]">{post.title}</h1>
      <p className="mt-3 text-[13px] leading-[1.55] text-[#74717F]">
        <span className="font-semibold text-[#201D2B]">{post.authorName}</span>
        <span className="mx-2">{formatDateTime(post.createdAt)}</span>· 조회 {post.viewCount ?? 0}
      </p>

      {/* 본문은 줄바꿈을 그대로 보여 줍니다. 마크다운 렌더링은 필요해지면 추가해 주세요. */}
      <div className="mt-6 text-[15px] leading-[1.7] whitespace-pre-wrap text-[#2E2D3A]">
        {post.body}
      </div>

      {post.tags && post.tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs leading-[1.5] text-[#6C6980]"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-zinc-200 pt-5">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-[13px] leading-[1.5] font-semibold text-indigo-600 hover:bg-indigo-100"
        >
          👍 좋아요 {post.likeCount ?? 0}
        </button>
      </div>
    </article>
  );
}
