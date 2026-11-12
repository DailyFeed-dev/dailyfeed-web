import BoardCommentItem, { type BoardCommentData } from '../organisms/BoardCommentItem';

// 임시 데이터입니다. 댓글 API 연결 후 props 로 받도록 바꿔 주세요.
const COMMENTS: BoardCommentData[] = [
  {
    id: 1,
    author: '박서연',
    createdAt: '10분 전',
    content: '체크리스트 항목이 실무에 바로 쓰기 좋게 정리되어 있네요. 우리 팀 킥오프에 써볼게요.',
    likes: 3,
    replies: [
      {
        id: 11,
        author: '서지연',
        createdAt: '5분 전',
        content: '도움이 되었다니 다행이에요! 써보시고 부족한 부분 알려 주세요.',
        likes: 1,
      },
    ],
  },
  {
    id: 2,
    author: '최동하',
    createdAt: '1시간 전',
    content: '역할과 책임 부분이 특히 도움이 됐어요. 감사합니다!',
    likes: 2,
  },
  {
    id: 3,
    author: '이상민',
    createdAt: '어제',
    content: '일정 합의 항목은 노션 템플릿으로도 공유해 주시면 좋겠어요.',
    likes: 0,
  },
];

// 댓글 영역 — 제목, 입력창, 목록, 더보기
export default function BoardCommentSection() {
  return (
    <section aria-label="댓글" className="mt-10">
      <h2 className="text-base leading-[1.5] font-semibold text-[#201D2B]">
        댓글 <span className="text-indigo-600">4</span>
      </h2>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white p-4">
        <textarea
          aria-label="댓글 입력"
          rows={2}
          placeholder="댓글을 입력해 주세요."
          className="w-full resize-none bg-transparent text-sm leading-[1.6] text-[#2E2D3A] outline-none placeholder:text-[#74717F]"
        />
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="rounded-full bg-indigo-600 px-4 py-1.5 text-[13px] leading-[1.5] font-semibold text-white hover:bg-indigo-700"
          >
            댓글 작성
          </button>
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-6">
        {COMMENTS.map((comment) => (
          <BoardCommentItem key={comment.id} comment={comment} />
        ))}
      </ul>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-[13px] leading-[1.5] font-semibold text-[#201D2B] hover:bg-zinc-50"
        >
          댓글 더보기 ⌄
        </button>
      </div>
    </section>
  );
}
