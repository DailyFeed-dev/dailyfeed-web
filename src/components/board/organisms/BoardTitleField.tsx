'use client';

import { useState } from 'react';
import { BORDER_DEFAULT, BORDER_ERROR, BORDER_FILLED, LABEL } from '../boardWriteStyles';

const MAX_LENGTH = 100;

// 글쓰기 제목 — 필수 입력. 제출했는데 비어 있으면 빨간 테두리와 안내 문구를 보여 줍니다.
export default function BoardTitleField() {
  const [value, setValue] = useState('');
  const [missing, setMissing] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor="write-title" className={LABEL}>
        제목 *
      </label>
      <input
        id="write-title"
        name="title"
        type="text"
        required
        maxLength={MAX_LENGTH}
        value={value}
        placeholder="제목을 입력해 주세요"
        aria-describedby="write-title-message"
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          // 공백만 있는 제목은 빈 값으로 취급합니다.
          event.target.setCustomValidity(next.trim() ? '' : '제목을 입력해 주세요.');
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
        className={`rounded-lg border-[1.5px] bg-white ${
          missing ? BORDER_ERROR : value.trim() ? BORDER_FILLED : BORDER_DEFAULT
        } h-[46px] px-4 text-sm leading-[1.55] text-[#201D2B] outline-none placeholder:text-[#6C6980] focus:border-[#6157E9]`}
      />
      <div className="flex items-center gap-3">
        <p
          id="write-title-message"
          className={`flex-1 text-xs leading-[1.55] ${missing ? 'text-[#D41717]' : 'text-[#74717F]'}`}
        >
          {missing ? '제목을 입력해 주세요.' : '글의 내용을 잘 나타내는 제목을 적어주세요.'}
        </p>
        <p className="text-[11px] leading-[1.55] text-[#74717F]">
          {value.length} / {MAX_LENGTH}
        </p>
      </div>
    </div>
  );
}
