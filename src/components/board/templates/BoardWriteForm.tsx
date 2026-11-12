import { Check } from 'lucide-react';
import { LABEL } from '../boardWriteStyles';
import BoardCategorySelect from '../organisms/BoardCategorySelect';
import BoardContentField from '../organisms/BoardContentField';
import BoardTagField from '../organisms/BoardTagField';
import BoardTitleField from '../organisms/BoardTitleField';
import BoardWriteHeader from '../organisms/BoardWriteHeader';

// 게시글 작성 폼 — 카테고리, 제목, 내용, 태그, 이용 수칙 확인, 임시저장·등록 버튼
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

      <BoardTagField />

      {/* 이용 수칙 확인(왼쪽), 임시저장·글 등록하기(오른쪽) — 글 등록하기는 제출 버튼이라 필수 항목 검사를 합니다. 저장·등록은 API 연결 후 붙여 주세요. */}
      <div className="flex items-center justify-between gap-2.5">
        <label className="flex items-center gap-2.5">
          <input type="checkbox" defaultChecked className="peer sr-only" />
          <span
            aria-hidden="true"
            className="inline-flex size-[18px] shrink-0 items-center justify-center rounded bg-[#6157E9] text-white peer-not-checked:border peer-not-checked:border-[#E7E5EE] peer-not-checked:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300"
          >
            <Check className="size-3.5 peer-not-checked:hidden" strokeWidth={3} />
          </span>
          <span className="text-xs leading-[1.55] text-[#74717F]">
            게시판 이용 수칙과 개인정보 포함 여부를 확인했습니다.
          </span>
        </label>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            className="rounded-[21px] border border-[#E7E5EE] bg-white px-6 py-[11px] text-[13px] leading-[1.55] font-medium text-[#201D2B] hover:bg-zinc-50"
          >
            임시저장
          </button>
          <button
            type="submit"
            className="h-[42px] w-[113px] rounded-[20px] bg-[#6157E9] text-[13px] leading-normal font-medium text-white transition-colors hover:bg-[#4B3FD6]"
          >
            글 등록하기
          </button>
        </div>
      </div>
    </section>
  );
}
