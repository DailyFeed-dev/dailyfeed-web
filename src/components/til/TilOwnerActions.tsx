'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { buttonClassName } from '@/components/common/Button';
import { deleteTil } from '@/services/tilService';

import { TilIcon } from './TilTempUi';
import { TIL_BOARD_BASE, tilEditHref, tilErrorMessage } from './tilBoardUrl';

/** 내가 쓴 글에서만 보이는 수정 · 삭제 버튼 (디자인: Owner Actions 171:20527) */
export default function TilOwnerActions({ tilId }: { tilId: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('이 TIL을 삭제할까요? 삭제한 글은 되돌릴 수 없어요.')) return;
    setDeleting(true);
    try {
      await deleteTil(tilId);
      router.push(TIL_BOARD_BASE);
    } catch (error) {
      window.alert(tilErrorMessage(error, '삭제하지 못했어요.'));
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={tilEditHref(tilId)}
        className={buttonClassName({
          variant: 'soft',
          size: 'sm',
          className: 'border border-(--color-border-brand-soft)',
        })}
      >
        <TilIcon name="pencil" />
        수정
      </Link>
      {/* 공통 Button 에 위험(danger) 스타일이 없어 디자인대로 만듭니다. */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#f6d4d5] bg-white py-2 pr-4 pl-3.5 text-[13px] leading-[1.4] font-semibold whitespace-nowrap text-[#e5484d] hover:bg-[#fff5f5] disabled:cursor-default disabled:opacity-50"
      >
        <TilIcon name="trash" />
        삭제
      </button>
    </div>
  );
}
