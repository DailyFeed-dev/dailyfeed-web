import { Check } from 'lucide-react';
import { focusFirstInvalid } from '@/lib/focus-first-invalid';
import { LABEL } from '../boardWriteStyles';
import BoardCategorySelect from '../organisms/BoardCategorySelect';
import BoardContentField from '../organisms/BoardContentField';
import BoardTagField from '../organisms/BoardTagField';
import BoardTitleField from '../organisms/BoardTitleField';
import BoardWriteHeader from '../organisms/BoardWriteHeader';

// 게시글 작성 폼 — 카테고리, 제목, 내용, 태그, 이용 수칙 확인, 임시저장·등록 버튼
// 등록은 부모(BoardWritePage)가 처리하고, 이 폼은 등록 중 여부와 실패 문구만 받아 보여 줍니다.
export default function BoardWriteForm({
  submitting = false,
  submitError,
}: {
  submitting?: boolean;
  submitError?: string | null;
}) {
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

      {submitError && (
        <p role="alert" className="text-xs leading-[1.55] text-[#D41717]">
          {submitError}
        </p>
      )}

      {/* 이용 수칙 확인(왼쪽), 임시저장·글 등록하기(오른쪽) — 글 등록하기는 제출 버튼이라 필수 항목 검사를 합니다. 임시저장은 아직 동작하지 않습니다. */}
      <div className="flex items-center justify-between gap-2.5">
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            defaultChecked
            required
            className="peer sr-only"
            onInvalid={(event) => {
              event.preventDefault(); // 브라우저 기본 말풍선 대신 아래 에러 표시를 씁니다.
              focusFirstInvalid(event.currentTarget);
            }}
          />
          <span
            aria-hidden="true"
            className="inline-flex size-[18px] shrink-0 items-center justify-center rounded bg-[#6157E9] text-white peer-not-checked:border peer-not-checked:border-[#E7E5EE] peer-not-checked:bg-white peer-user-invalid:border-[#D41717] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300"
          >
            <Check className="size-3.5 peer-not-checked:hidden" strokeWidth={3} />
          </span>
          <span className="text-xs leading-[1.55] text-[#74717F] peer-user-invalid:text-[#D41717]">
            게시판 이용 수칙과 개인정보 포함 여부를 확인했습니다.
          </span>
        </label>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            disabled={submitting}
            className="rounded-[21px] border border-[#E7E5EE] bg-white px-6 py-[11px] text-[13px] leading-[1.55] font-medium text-[#201D2B] hover:bg-zinc-50"
          >
            임시저장
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-[42px] w-[113px] rounded-[20px] bg-[#6157E9] text-[13px] leading-normal font-medium text-white transition-colors hover:bg-[#4B3FD6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '등록 중…' : '글 등록하기'}
          </button>
        </div>
      </div>
    </section>
  );
}
