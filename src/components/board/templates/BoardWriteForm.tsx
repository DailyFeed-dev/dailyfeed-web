import { AlignLeft, Check, FileCode } from 'lucide-react';
import BoardCategorySelect from '../organisms/BoardCategorySelect';
import BoardWriteHeader from '../organisms/BoardWriteHeader';

const LABEL = 'text-sm leading-[1.55] font-bold text-[#201D2B]';
const FIELD_BORDER = 'rounded-lg border border-[#E7E5EE] bg-white';

// 게시글 작성 폼 — 카테고리, 제목, 내용, 태그, 이용 수칙 확인
// 화면만 만든 상태입니다. 입력값 처리와 등록은 API 연결 후 붙여 주세요.
export default function BoardWriteForm() {
  return (
    <section
      aria-label="게시글 작성"
      className="flex flex-col gap-7 rounded-xl border border-zinc-200 bg-white px-8 pt-7 pb-8"
    >
      <BoardWriteHeader />

      {/* 카테고리 */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="write-category" className={LABEL}>
          카테고리 *
        </label>
        <BoardCategorySelect id="write-category" />
      </div>

      {/* 제목 */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="write-title" className={LABEL}>
          제목 *
        </label>
        <input
          id="write-title"
          type="text"
          defaultValue="팀 협업을 위한 프로젝트 킥오프 템플릿"
          className={`${FIELD_BORDER} px-4 py-[13px] text-sm leading-[1.55] text-[#201D2B] outline-none`}
        />
        <div className="flex items-center gap-3 text-[#74717F]">
          <p className="flex-1 text-xs leading-[1.55]">
            글의 내용을 잘 나타내는 제목을 적어주세요.
          </p>
          <p className="text-[11px] leading-[1.55]">21 / 100</p>
        </div>
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="write-content" className={LABEL}>
          내용 *
        </label>
        <div className={`${FIELD_BORDER} overflow-hidden`}>
          <div className="flex items-center gap-4 bg-[#F8F7FC] px-4 py-3">
            <div className="flex gap-1 rounded-xl border border-[#F0EFF5] bg-[#F6F5FB] p-1">
              <span className="inline-flex items-center gap-1.5 rounded-[9px] bg-white px-4 py-2 text-sm leading-[1.4] font-semibold text-[#4B3FD6] shadow-[0_2px_6px_rgba(31,28,43,0.08)]">
                <AlignLeft aria-hidden="true" className="size-4.5" />
                텍스트
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[9px] px-4 py-2 text-sm leading-[1.4] font-medium text-[#6B6A7B]">
                <FileCode aria-hidden="true" className="size-4.5" />
                마크다운
              </span>
            </div>
            <p className="flex-1 text-[13px] leading-[1.55] font-medium whitespace-pre text-[#74717F]">
              {'B   /   U   ·   목록   ·   링크'}
            </p>
          </div>
          <textarea
            id="write-content"
            rows={10}
            defaultValue={
              '프로젝트의 시작을 조금 더 단단하게 만들어 보세요.\n\n목표 정리부터 역할 분담, 일정 합의까지 함께 논의할 수 있도록\n실제 팀에서 사용하는 킥오프 진행 방식을 글로 정리했습니다.'
            }
            className="block w-full resize-none px-5 pt-5 pb-6 text-sm leading-[1.55] text-[#201D2B] outline-none"
          />
          <div className="flex items-center gap-3 px-5 pb-3 text-[11px] leading-[1.55] text-[#74717F]">
            <p className="flex-1">경험과 생각을 자유롭게 적어주세요.</p>
            <p>작성 중</p>
          </div>
        </div>
      </div>

      {/* 태그 */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="write-tag" className={LABEL}>
          태그
        </label>
        <div className={`${FIELD_BORDER} flex flex-wrap items-center gap-2 px-3 py-2.5`}>
          {['프로젝트 관리', '업무 효율', '팀 협업'].map((tag) => (
            <span
              key={tag}
              className="rounded-[26px] bg-[#F0EEFF] px-2.5 py-[5px] text-[11px] leading-[1.55] font-medium text-[#6157E9]"
            >
              #{tag} ×
            </span>
          ))}
          <input
            id="write-tag"
            type="text"
            aria-label="태그 입력"
            className="min-w-20 flex-1 outline-none"
          />
        </div>
        <p className="text-[11px] leading-[1.55] text-[#74717F]">
          태그를 입력하고 Enter를 눌러주세요. 최대 5개까지 추가할 수 있어요.
        </p>
      </div>

      {/* 이용 수칙 확인 */}
      <label className="flex items-center gap-2.5">
        <input type="checkbox" defaultChecked className="peer sr-only" />
        <span
          aria-hidden="true"
          className="inline-flex size-[18px] items-center justify-center rounded bg-[#6157E9] text-white peer-not-checked:border peer-not-checked:border-[#E7E5EE] peer-not-checked:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300"
        >
          <Check className="size-3.5 peer-not-checked:hidden" strokeWidth={3} />
        </span>
        <span className="text-xs leading-[1.55] text-[#74717F]">
          게시판 이용 수칙과 개인정보 포함 여부를 확인했습니다.
        </span>
      </label>
    </section>
  );
}
