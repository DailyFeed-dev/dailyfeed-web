export type BoardCommentData = {
  id: number;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  replies?: BoardCommentData[];
};

// 댓글 한 개와 그 아래 대댓글입니다. (모양만 있고 동작은 아직 연결하지 않았습니다)
export default function BoardCommentItem({
  comment,
  isReply = false,
}: {
  comment: BoardCommentData;
  isReply?: boolean;
}) {
  const replies = comment.replies ?? [];

  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 ${
          isReply ? 'size-7' : 'size-9'
        }`}
      >
        {comment.author.slice(0, 1)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] leading-[1.55] font-semibold text-[#201D2B]">
            {comment.author}
          </span>
          <span className="text-xs leading-normal text-[#74717F]">{comment.createdAt}</span>
        </div>
        <p className="mt-1 text-[15px] leading-[1.7] text-[#2E2D3A]">{comment.content}</p>
        <div className="mt-1.5 flex items-center gap-3 text-xs leading-normal text-[#74717F]">
          <button type="button" className="hover:text-[#201D2B]">
            ♡ {comment.likes}
          </button>
          {!isReply && (
            <button type="button" className="hover:text-[#201D2B]">
              답글 달기
            </button>
          )}
        </div>

        {replies.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              className="text-xs leading-normal font-medium text-indigo-600 hover:text-indigo-700"
            >
              ▾ 답글 {replies.length}개 숨기기
            </button>
            <ul className="mt-3 flex flex-col gap-4">
              {replies.map((reply) => (
                <BoardCommentItem key={reply.id} comment={reply} isReply />
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
