'use client';

import { AlignLeft, FileCode } from 'lucide-react';
import { useState } from 'react';
import {
  BORDER_DEFAULT,
  BORDER_ERROR,
  BORDER_FILLED,
  FIELD_BORDER,
  LABEL,
} from '../boardWriteStyles';

// 글쓰기 내용 — 편집 도구, 본문, 상태 줄. 필수 입력이라 제출했는데 비어 있으면 빨간 테두리를 보여 줍니다.
// 편집 도구(텍스트/마크다운, B / U / 목록 / 링크)는 모양만 있고 아직 동작하지 않습니다.
export default function BoardContentField() {
  const [filled, setFilled] = useState(false);
  const [missing, setMissing] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor="write-content" className={LABEL}>
        내용 *
      </label>
      <div
        className={`${FIELD_BORDER} ${missing ? BORDER_ERROR : filled ? BORDER_FILLED : BORDER_DEFAULT} overflow-hidden focus-within:border-[#6157E9]`}
      >
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
          name="content"
          rows={10}
          required
          placeholder="내용을 입력해 주세요"
          aria-describedby="write-content-message"
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
          className="block w-full resize-none px-5 pt-5 pb-6 text-sm leading-[1.55] text-[#201D2B] outline-none placeholder:text-[#6C6980]"
        />
        <div className="flex items-center gap-3 px-5 pb-3 text-[11px] leading-[1.55] text-[#74717F]">
          <p id="write-content-message" className={`flex-1 ${missing ? 'text-[#D41717]' : ''}`}>
            {missing ? '내용을 입력해 주세요.' : '경험과 생각을 자유롭게 적어주세요.'}
          </p>
          <p>작성 중</p>
        </div>
      </div>
    </div>
  );
}
