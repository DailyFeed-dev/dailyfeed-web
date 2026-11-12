'use client';

import { useState } from 'react';
import {
  BORDER_DEFAULT,
  BORDER_ERROR,
  BORDER_FILLED,
  FIELD_BORDER,
  LABEL,
} from '../boardWriteStyles';

// 글쓰기 내용 — 필수 입력이라 제출했는데 비어 있으면 빨간 테두리를 보여 줍니다.
export default function BoardContentField() {
  const [filled, setFilled] = useState(false);
  const [missing, setMissing] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor="write-content" className={LABEL}>
        내용 *
      </label>
      <textarea
        id="write-content"
        name="content"
        required
        placeholder="내용을 입력해 주세요"
        onChange={(event) => {
          const next = event.target.value;
          // 공백만 있는 내용은 빈 값으로 취급합니다.
          event.target.setCustomValidity(next.trim() ? '' : '내용을 입력해 주세요.');
          setFilled(Boolean(next.trim()));
          if (next.trim()) setMissing(false);
        }}
        onInvalid={(event) => {
          event.preventDefault(); // 브라우저 기본 말풍선 대신 아래 에러 표시를 씁니다.
          setMissing(true);
          // 비어 있는 칸이 여러 개면 맨 위 칸에만 포커스를 줍니다.
          if (event.currentTarget.form?.querySelector(':invalid') === event.currentTarget) {
            event.currentTarget.focus();
          }
        }}
        className={`${FIELD_BORDER} ${
          missing ? BORDER_ERROR : filled ? BORDER_FILLED : BORDER_DEFAULT
        } block h-[400px] w-full resize-none px-5 py-5 text-sm leading-[1.55] text-[#201D2B] outline-none placeholder:text-[#6C6980] focus:border-[#6157E9]`}
      />
    </div>
  );
}
