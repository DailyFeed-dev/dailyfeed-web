'use client';

import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { BORDER_DEFAULT, BORDER_FILLED, FIELD_BORDER, LABEL } from '../boardWriteStyles';

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;
const HELPER = `태그를 입력하고 Enter를 눌러주세요. 최대 ${MAX_TAGS}개까지 추가할 수 있어요.`;

// 글쓰기 태그 — Enter(또는 쉼표)로 추가하고 ×로 지웁니다. 최대 5개, 같은 태그는 한 번만 넣을 수 있습니다.
// 입력한 태그는 name="tags" 로 폼에 함께 담깁니다. (등록은 API 연결 후 붙여 주세요)
export default function BoardTagField() {
  const [tags, setTags] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [warning, setWarning] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag() {
    // 앞의 # 은 떼고 저장합니다. (화면에서는 #을 붙여 보여 줍니다)
    const tag = draft.trim().replace(/^#+/, '').trim();
    if (!tag) {
      setDraft('');
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setWarning(`태그는 최대 ${MAX_TAGS}개까지 추가할 수 있어요.`);
      return;
    }
    if (tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setWarning('이미 추가한 태그예요.');
      return;
    }
    setTags([...tags, tag]);
    setDraft('');
    setWarning(null);
  }

  function removeTag(target: string) {
    setTags(tags.filter((tag) => tag !== target));
    setWarning(null);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor="write-tag" className={LABEL}>
        태그
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className={`${FIELD_BORDER} ${
          tags.length > 0 ? BORDER_FILLED : BORDER_DEFAULT
        } flex min-h-[46px] flex-wrap items-center gap-2 px-3 py-2.5 focus-within:border-[#6157E9]`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-[26px] bg-[#F0EEFF] py-0.5 pr-2 pl-2.5 text-[11px] leading-[1.55] font-medium text-[#6157E9]"
          >
            #{tag}
            <button
              type="button"
              aria-label={`${tag} 태그 삭제`}
              onClick={() => removeTag(tag)}
              className="inline-flex rounded-full hover:bg-[#E2DEFF]"
            >
              <X aria-hidden="true" className="size-3" strokeWidth={2.5} />
            </button>
            <input type="hidden" name="tags" value={tag} />
          </span>
        ))}
        <input
          ref={inputRef}
          id="write-tag"
          type="text"
          value={draft}
          maxLength={MAX_TAG_LENGTH}
          placeholder={tags.length === 0 ? '태그를 입력하세요' : undefined}
          aria-describedby="write-tag-message"
          onChange={(event) => {
            setDraft(event.target.value);
            setWarning(null);
          }}
          onKeyDown={(event) => {
            // 한글 입력 중의 Enter 는 글자를 확정하는 용도라서 태그로 추가하지 않습니다.
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault(); // Enter 로 폼이 제출되지 않게 막습니다.
              addTag();
            } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
              setTags(tags.slice(0, -1));
            }
          }}
          className="min-w-24 flex-1 bg-transparent text-sm leading-[1.55] text-[#201D2B] outline-none placeholder:text-[#6C6980]"
        />
      </div>
      <p
        id="write-tag-message"
        className={`text-[11px] leading-[1.55] ${warning ? 'text-[#D41717]' : 'text-[#74717F]'}`}
      >
        {warning ?? HELPER}
      </p>
    </div>
  );
}
