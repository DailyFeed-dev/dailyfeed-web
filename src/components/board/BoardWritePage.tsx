'use client';

import Link from 'next/link';
import BoardWriteActions from './templates/BoardWriteActions';
import BoardWriteForm from './templates/BoardWriteForm';

// 게시판 글쓰기 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
export default function BoardWritePage() {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 pt-9 pb-16">
      <header className="flex flex-col gap-4">
        <Link
          href="/board"
          className="text-[13px] leading-[1.55] font-medium text-[#74717F] hover:text-[#201D2B]"
        >
          ← 게시판 목록으로
        </Link>
        <h1 className="text-[30px] leading-[1.55] font-bold text-[#201D2B]">글쓰기</h1>
        <p className="text-sm leading-[1.55] text-[#74717F]">
          일하는 경험과 생각을 나누고, 함께 이야기해요.
        </p>
      </header>
      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <BoardWriteForm />
        <BoardWriteActions />
      </form>
    </div>
  );
}
