'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getTil, getTilCurrentUser, updateTil } from '@/services/tilService';
import type { Schemas } from '@/lib/api';

import TilEditor from './TilEditor';
import TilEditorSkeleton from './TilEditorSkeleton';
import TilNotice from './TilNotice';
import {
  TIL_BOARD_BASE,
  formatTilDate,
  isSameUser,
  isUnauthorized,
  tilDetailHref,
  tilErrorMessage,
} from './tilBoardUrl';

type State = {
  id: number;
  til?: Schemas['TilResponse'];
  me?: Schemas['AuthorResponse'];
  error?: unknown;
};

function Notice(props: Parameters<typeof TilNotice>[0]) {
  return (
    <div className="mx-auto w-full max-w-180 py-10">
      <TilNotice {...props} />
    </div>
  );
}

/** TIL 수정 (/til/edit?id=13). 내가 쓴 글만 수정할 수 있습니다. */
export default function TilEditPage({ tilId }: { tilId: number }) {
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([getTil(tilId), getTilCurrentUser()]).then(
      ([til, me]) => {
        if (!ignore) setState({ id: tilId, til, me });
      },
      (error: unknown) => {
        if (!ignore) setState({ id: tilId, error });
      },
    );
    return () => {
      ignore = true;
    };
  }, [tilId]);

  if (!state || state.id !== tilId) return <TilEditorSkeleton />;

  const { til, me } = state;
  if (!til || !me) {
    return (
      <Notice
        message={tilErrorMessage(state.error, 'TIL을 불러오지 못했어요.')}
        needLogin={isUnauthorized(state.error)}
        link={{ href: TIL_BOARD_BASE, label: 'TIL 게시판으로' }}
      />
    );
  }
  if (!isSameUser(til.author?.id, me.id)) {
    return (
      <Notice
        message="내가 쓴 글만 수정할 수 있어요."
        link={{ href: tilDetailHref(tilId), label: '글로 돌아가기' }}
      />
    );
  }

  const submit = async (input: Schemas['UpdateTilRequest']) => {
    await updateTil(tilId, input);
    router.push(tilDetailHref(tilId));
  };

  return (
    <TilEditor
      key={tilId}
      authorName={me.name ?? ''}
      date={formatTilDate(til.createdAt)}
      initialValue={{ title: til.title ?? '', body: til.body ?? '' }}
      submitLabel="수정하기"
      onSubmit={submit}
    />
  );
}
