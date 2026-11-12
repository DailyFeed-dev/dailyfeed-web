import Avatar from '@/components/common/Avatar';
import { getPostAuthor, type Post } from '@/services/postService';
import BoardCategoryBadge from '../atoms/BoardCategoryBadge';
import { formatDateTime } from '../boardFormat';
import BoardPostLikeButton from '../organisms/BoardPostLikeButton';
import BoardProfileTrigger from '../organisms/BoardProfileTrigger';

// 게시글 상세 카드 — 제목, 작성자(누르면 프로필 팝오버), 본문, 태그, 좋아요
// isMe: 내가 쓴 글이면 작성자를 눌러도 프로필 팝오버가 열리지 않습니다.
export default function BoardDetailPost({ post, isMe = false }: { post: Post; isMe?: boolean }) {
  const author = getPostAuthor(post);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-8">
      <BoardCategoryBadge code={post.category} />
      <h1 className="mt-3 text-2xl leading-8 font-bold text-[#201D2B]">{post.title}</h1>
      <div className="mt-4 flex items-center gap-3">
        <BoardProfileTrigger
          author={author}
          isMe={isMe}
          triggerClassName="-my-1 -ml-1.5 gap-3 rounded-[10px] py-1 pr-3 pl-1.5 transition-colors hover:bg-[#f0eefe]/60"
          openClassName="bg-[#f0eefe] hover:bg-[#f0eefe]"
        >
          <Avatar name={author.name} src={author.avatarUrl} size={40} color="#1f1d2b" />
          <span className="flex flex-col gap-0.5 leading-[1.4]">
            <span className="text-[15px] font-semibold text-[#1f1d2b]">{author.name}</span>
            <span className="text-[13px] text-[#9a99a8]">{formatDateTime(post.createdAt)}</span>
          </span>
        </BoardProfileTrigger>
        <span className="text-[13px] text-[#9a99a8]">· 조회 {post.viewCount ?? 0}</span>
      </div>

      {/* 본문은 줄바꿈을 그대로 보여 줍니다. 마크다운 렌더링은 필요해지면 추가해 주세요. */}
      <div className="mt-6 text-[15px] leading-[1.7] wrap-anywhere whitespace-pre-wrap text-[#2E2D3A]">
        {post.content}
      </div>

      {post.tags && post.tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs leading-normal text-[#6C6980]"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-center border-t border-zinc-200 pt-5">
        <BoardPostLikeButton postId={post.id ?? 0} initialLikeCount={post.likeCount ?? 0} />
      </div>
    </article>
  );
}
