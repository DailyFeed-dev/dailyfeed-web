// 임시 데이터입니다. 게시글 API 연결 후 props 로 받도록 바꿔 주세요.
const POST = {
  category: '템플릿',
  title: '팀 협업을 위한 프로젝트 킥오프 템플릿',
  author: '서지연',
  createdAt: '2026.11.10 09:30',
  views: 328,
  intro:
    '프로젝트의 시작을 조금 더 단단하게 만들어 보세요. 목표 정리부터 역할 분담, 일정 합의까지 한 번에 진행할 수 있도록 실제 팀에서 사용하는 킥오프 템플릿을 정리했습니다.',
  listTitle: '이런 내용이 담겨 있어요',
  items: ['프로젝트 배경과 목표', '역할과 책임', '주요 일정과 체크리스트'],
  tags: ['프로젝트 관리', '업무 효율', '팀 협업'],
  likes: 24,
};

// 게시글 상세 카드 — 제목, 작성 정보, 본문, 태그, 반응
export default function BoardDetailPost() {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-8">
      <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[13px] leading-[1.5] font-medium text-indigo-600">
        {POST.category}
      </span>
      <h1 className="mt-3 text-2xl leading-8 font-bold text-[#201D2B]">{POST.title}</h1>
      <p className="mt-3 text-[13px] leading-[1.55] text-[#74717F]">
        <span className="font-semibold text-[#201D2B]">{POST.author}</span>
        <span className="mx-2">{POST.createdAt}</span>· 조회 {POST.views}
      </p>

      <div className="mt-6 text-[15px] leading-[1.7] text-[#2E2D3A]">
        <p>{POST.intro}</p>
        <h2 className="mt-6 font-semibold text-[#201D2B]">{POST.listTitle}</h2>
        <ol className="mt-3 flex flex-col gap-1.5">
          {POST.items.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="font-semibold text-indigo-600">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {POST.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs leading-[1.5] text-[#6C6980]"
          >
            #{tag}
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-zinc-200 pt-5">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-[13px] leading-[1.5] font-semibold text-indigo-600 hover:bg-indigo-100"
        >
          👍 좋아요 {POST.likes}
        </button>
      </div>
    </article>
  );
}
