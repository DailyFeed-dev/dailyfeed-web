'use client';

import { useState } from 'react';

// 임시 데이터입니다. 게시글 API 연결 후 props 로 받도록 바꿔 주세요.
const CATEGORIES = [
  { id: 'all', label: '전체', count: 128 },
  { id: 'info', label: '정보', count: 48 },
  { id: 'free', label: '자유글', count: 32 },
  { id: 'design', label: '디자인', count: 28 },
  { id: 'dev', label: '개발', count: 20 },
];

// 게시글 메뉴바 — 카테고리 탭, 게시글 수, 검색, 정렬
export default function BoardPageMenuBar() {
  const [selected, setSelected] = useState('all');
  const [keyword, setKeyword] = useState('');

  return (
    <nav aria-label="게시판 메뉴" className="pt-11 pb-5">
      <div role="tablist" className="flex gap-7 border-b border-zinc-200">
        {CATEGORIES.map((category) => {
          const isSelected = category.id === selected;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelected(category.id)}
              className={`-mb-px flex flex-col items-stretch gap-2 pt-2 text-sm leading-[1.5] ${
                isSelected
                  ? 'font-semibold text-[#1F1D2B]'
                  : 'font-medium text-[#6C6980] hover:text-[#1F1D2B]'
              }`}
            >
              {category.label} {category.count}
              <span
                aria-hidden="true"
                className={`h-0.5 ${isSelected ? 'bg-indigo-600' : 'bg-transparent'}`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-[13px] leading-[1.55] text-[#6C6980]">총 128개의 글</p>

        <div className="flex items-center gap-2">
          <label className="flex w-78 items-center gap-2 rounded-lg bg-zinc-100 px-3.5 py-2.5 text-[#6C6980]">
            <SearchIcon className="size-4.5 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="제목, 내용, 태그로 검색"
              className="min-w-0 flex-1 bg-transparent text-sm leading-[1.55] text-[#1F1D2B] outline-none placeholder:text-[#6C6980]"
            />
          </label>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm leading-[1.5] font-semibold text-[#1F1D2B] hover:bg-zinc-50"
          >
            검색
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm leading-[1.5] font-semibold text-[#1F1D2B] hover:bg-zinc-50"
          >
            최신순
            <ChevronDownIcon className="size-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
