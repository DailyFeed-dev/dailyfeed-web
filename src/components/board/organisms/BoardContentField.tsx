'use client';

import { useState } from 'react';
import { focusFirstInvalid } from '@/lib/focus-first-invalid';
import {
  BORDER_DEFAULT,
  BORDER_ERROR,
  BORDER_FILLED,
  FIELD_BORDER,
  FIELD_PX,
  LABEL,
} from '../boardWriteStyles';

// 글쓰기 내용 — 필수 입력이라 제출했는데 비어 있으면 빨간 테두리를 보여 줍니다.
export default function BoardContentField() {
  const [filled, setFilled] = useState(false);
  const [missing, setMissing] = useState(false);
  // 사용자가 직접 누르거나 입력 중인지. 에러 색(빨강)과 포커스 색(보라) 중 무엇을 보여 줄지 정합니다.
  const [engaged, setEngaged] = useState(false);

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
          setEngaged(false);
          focusFirstInvalid(event.currentTarget); // 맨 위 빈 칸으로 이동
        }}
        // 에러가 처음 뜰 때는 코드가 포커스를 옮겨도 빨간색을 유지하고, 직접 누르거나 입력하면 보라색이 됩니다.
        onPointerDown={() => setEngaged(true)}
        onKeyDown={() => setEngaged(true)}
        onBlur={() => setEngaged(false)}
        className={`${FIELD_BORDER} ${
          missing
            ? engaged
              ? BORDER_FILLED
              : BORDER_ERROR
            : filled
              ? BORDER_FILLED
              : BORDER_DEFAULT
        } block h-[400px] w-full resize-none ${FIELD_PX} py-3.5 text-sm leading-[1.55] text-[#201D2B] outline-none placeholder:text-[#6C6980] ${
          missing ? '' : 'focus:border-[#6157E9]'
        }`}
      />
    </div>
  );
}
