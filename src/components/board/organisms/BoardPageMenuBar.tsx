'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BOARD_CATEGORIES, type BoardCategory } from '../boardCategories';

// 탭 목록 — 전체는 ?category= 를 생략한 주소(/board)입니다.
const TABS = [
  { code: undefined, label: '전체', href: '/board' },
  ...BOARD_CATEGORIES.map(({ code, label }) => ({
    code,
    label,
    href: `/board?category=${code}`,
  })),
];

// 게시글 메뉴바 — 카테고리 탭, 검색, 정렬
// category: 현재 선택된 카테고리 (URL 의 ?category= 값, 없으면 전체)
export default function BoardPageMenuBar({ category }: { category?: BoardCategory }) {
  const [keyword, setKeyword] = useState('');

  return (
    <nav aria-label="게시판 메뉴" className="pt-5 pb-5">
      <div role="tablist" className="flex gap-7 border-b border-zinc-200">
        {TABS.map((tab) => {
          const isSelected = tab.code === category;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              role="tab"
              aria-selected={isSelected}
              className={`-mb-px flex flex-col items-stretch gap-2 pt-2 text-sm leading-[1.5] ${
                isSelected
                  ? 'font-semibold text-[#1F1D2B]'
                  : 'font-medium text-[#6C6980] hover:text-[#1F1D2B]'
              }`}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={`h-0.5 ${isSelected ? 'bg-indigo-600' : 'bg-transparent'}`}
              />
            </Link>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <div className="ml-auto flex items-center gap-2">
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
