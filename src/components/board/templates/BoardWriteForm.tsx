import { Check } from 'lucide-react';
import { BORDER_DEFAULT, FIELD_BORDER, LABEL } from '../boardWriteStyles';
import BoardCategorySelect from '../organisms/BoardCategorySelect';
import BoardContentField from '../organisms/BoardContentField';
import BoardTitleField from '../organisms/BoardTitleField';
import BoardWriteHeader from '../organisms/BoardWriteHeader';

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

      <BoardTitleField />

      <BoardContentField />

      {/* 태그 */}
      <div className="flex flex-col gap-2.5">
        <label htmlFor="write-tag" className={LABEL}>
          태그
        </label>
        <div
          className={`${FIELD_BORDER} ${BORDER_DEFAULT} flex flex-wrap items-center gap-2 px-3 py-2.5`}
        >
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
