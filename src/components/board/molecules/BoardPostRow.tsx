// 게시글 목록의 한 줄입니다. 머리글(BoardPostList)과 같은 칸 구성을 씁니다.
export const POST_GRID = 'grid grid-cols-[91px_1fr_112px_136px_84px_101px] items-center px-6';

export type BoardPostItem = {
  id: number;
  category: string;
  title: string;
  topic: string;
  author: string;
  createdAt: string;
  views: number;
  reactions: number;
  comments: number;
};

export default function BoardPostRow({ post }: { post: BoardPostItem }) {
  return (
    <div
      className={`${POST_GRID} h-17 border-b border-zinc-200 transition-colors hover:bg-indigo-50`}
    >
      <span className="w-fit justify-self-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[13px] leading-[1.5] font-medium text-indigo-600">
        {post.category}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm leading-[1.5] font-semibold text-[#1F1D2B]">{post.title}</p>
        <p className="truncate text-xs leading-[1.5] text-[#6C6980]">{post.topic}</p>
      </div>
      <span className="text-[13px] leading-[1.5] text-[#6C6980]">{post.author}</span>
      <span className="text-[13px] leading-[1.5] text-[#6C6980]">{post.createdAt}</span>
      <span className="text-[13px] leading-[1.5] text-[#6C6980]">{post.views}</span>
      <span className="text-[13px] leading-[1.5] text-[#6C6980]">
        {post.reactions} · {post.comments}
      </span>
    </div>
  );
}
