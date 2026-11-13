'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ApiError } from '@/lib/api';
import { createPost } from '@/services/postService';
import { parseCategory } from './boardCategories';
import BoardWriteForm from './templates/BoardWriteForm';

// 게시판 글쓰기 화면 — 담당자는 이 폴더(src/components/board) 안에서 작업합니다.
// key 가 새 이동(링크·push·replace)마다 바뀌어, 다시 들어오면 입력값·등록 중 상태 없이 처음부터 시작합니다.
// (캐시 컴포넌트가 숨겨 둔 이전 화면의 상태를 되살리지 않게 하는 용도. 브라우저 뒤로가기일 때만 복원됩니다.)
export default function BoardWritePage() {
  const { bfcacheId } = useRouter();
  return <BoardWriteContent key={bfcacheId} />;
}

function BoardWriteContent() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 필수 항목은 브라우저가 먼저 검사하고, 모두 채워졌을 때만 여기로 옵니다.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setSubmitError(null);
    try {
      const post = await createPost({
        title: String(form.get('title') ?? '').trim(),
        content: String(form.get('content') ?? '').trim(),
        category: parseCategory(String(form.get('category') ?? '')),
        tags: form.getAll('tags').map(String),
      });
      // 성공하면 방금 쓴 글로 이동합니다. 이동하는 동안에는 버튼을 계속 막아 둡니다.
      // replace 로 글쓰기 화면을 기록에서 빼서, 뒤로가기로 다시 글쓰기 화면이 열리지 않게 합니다.
      router.replace(post.id ? `/board/${post.id}` : '/board');
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.status === 401
            ? '로그인이 필요해요.'
            : error.message
          : '글을 등록하지 못했어요. 잠시 후 다시 시도해 주세요.',
      );
      setSubmitting(false);
    }
  }

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
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <BoardWriteForm submitting={submitting} submitError={submitError} />
      </form>
    </div>
  );
}
