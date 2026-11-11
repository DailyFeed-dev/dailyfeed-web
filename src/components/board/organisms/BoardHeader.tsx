// 게시글 상단: 제목, 소개글, 글쓰기 버튼
export default function BoardHeader() {
  return (
    <header className="flex items-start justify-between gap-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] leading-[1.3] font-bold tracking-[-0.3px] text-zinc-950">
          게시판
        </h1>
        <p className="text-sm leading-[1.55] text-zinc-500">
          일하는 경험과 생각을 나누고, 함께 이야기해요.
        </p>
      </div>

      {/* 글쓰기 페이지가 만들어지면 Link 로 바꿔 연결합니다. */}
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        글쓰기
      </button>
    </header>
  );
}
