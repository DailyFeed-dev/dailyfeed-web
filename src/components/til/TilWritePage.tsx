'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createTil, getTilCurrentUser } from '@/services/tilService';
import type { Schemas } from '@/lib/api';

import TilEditor from './TilEditor';
import TilEditorSkeleton from './TilEditorSkeleton';
import TilNotice from './TilNotice';
import {
  TIL_BOARD_BASE,
  TIL_WRITE_HREF,
  formatTilDate,
  isUnauthorized,
  tilDetailHref,
  tilErrorMessage,
} from './tilBoardUrl';

const DRAFT_KEY = 'dailyfeed.til.draft';

type State = { me?: Schemas['AuthorResponse']; error?: unknown };

/** 새 TIL 작성 (/til/write). 로그인해야 쓸 수 있습니다. */
export default function TilWritePage() {
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    let ignore = false;
    getTilCurrentUser().then(
      (me) => {
        if (!ignore) setState({ me });
      },
      (error: unknown) => {
        if (!ignore) setState({ error });
      },
    );
    return () => {
      ignore = true;
    };
  }, []);

  if (!state) return <TilEditorSkeleton />;

  if (!state.me) {
    return (
      <div className="mx-auto w-full max-w-180 py-10">
        <TilNotice
          message={
            isUnauthorized(state.error)
              ? 'TIL을 쓰려면 로그인해 주세요.'
              : tilErrorMessage(state.error, '작성 화면을 불러오지 못했어요.')
          }
          loginReturnTo={isUnauthorized(state.error) ? TIL_WRITE_HREF : undefined}
          link={{ href: TIL_BOARD_BASE, label: 'TIL 게시판으로' }}
        />
      </div>
    );
  }

  const submit = async (input: Schemas['CreateTilRequest']) => {
    const created = await createTil(input);
    router.push(tilDetailHref(created.id));
  };

  return (
    <TilEditor
      authorName={state.me.name ?? ''}
      date={formatTilDate(new Date().toISOString())}
      submitLabel="저장하기"
      draftKey={DRAFT_KEY}
      onSubmit={submit}
    />
  );
}
