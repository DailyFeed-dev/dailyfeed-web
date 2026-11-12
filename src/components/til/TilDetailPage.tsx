'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Badge from '@/components/common/Badge';
import { ApiError, type Schemas } from '@/lib/api';
import { getTil, getTilComments, getTilCurrentUser, hasTilLoginToken } from '@/services/tilService';

import { TilAuthorCard, TilAuthorTrigger } from './TilAuthorSection';
import TilCommentSection from './TilCommentSection';
import TilDetailSkeleton from './TilDetailSkeleton';
import TilMarkdown from './TilMarkdown';
import TilNotice from './TilNotice';
import TilOwnerActions from './TilOwnerActions';
import TilReactions from './TilReactions';
import { TilIcon } from './TilTempUi';
import {
  LOGIN_HREF,
  TIL_BOARD_BASE,
  formatTilDate,
  formatTilDateTime,
  isSameUser,
  isUnauthorized,
  tilErrorMessage,
} from './tilBoardUrl';

type Loaded = {
  til: Schemas['TilResponse'];
  comments: Schemas['CommentResponse'][];
  me: Schemas['AuthorResponse'] | null;
};

/** 만들 때 생기는 아주 작은 시간 차이는 무시하고, 1분 넘게 차이 나면 '수정됨' */
function isEdited({ createdAt, updatedAt }: Schemas['TilResponse']) {
  if (!createdAt || !updatedAt) return false;
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60_000;
}
type State = { id: number; data?: Loaded; error?: unknown };

function BackLink() {
  return (
    <Link
      href={TIL_BOARD_BASE}
      className="inline-flex items-center gap-1 self-start text-sm leading-[1.4] font-medium text-[#6b6a7b] hover:text-[#1f1d2b]"
    >
      <TilIcon name="chevron-left" size={18} strokeWidth={1.5} />
      TIL 게시판
    </Link>
  );
}

/** TIL 상세 (디자인: TIL Detail 126:4389 · 작성자 프로필 열림 136:4964) */
export default function TilDetailPage({ tilId }: { tilId: number }) {
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    // 상세는 로그인해야 볼 수 있어요. 토큰이 없으면 바로 로그인 페이지로 보냅니다.
    if (!hasTilLoginToken()) {
      router.replace(LOGIN_HREF);
      return;
    }

    let ignore = false;
    const me = getTilCurrentUser().catch(() => null);
    Promise.all([getTil(tilId), getTilComments(tilId), me]).then(
      ([til, comments, user]) => {
        if (!ignore) setState({ id: tilId, data: { til, comments, me: user } });
      },
      (error: unknown) => {
        if (ignore) return;
        // 토큰이 만료돼 갱신도 실패한 경우
        if (isUnauthorized(error)) router.replace(LOGIN_HREF);
        else setState({ id: tilId, error });
      },
    );
    return () => {
      ignore = true;
    };
  }, [tilId, router]);

  if (!state || state.id !== tilId) return <TilDetailSkeleton />;

  if (!state.data) {
    const notFound = state.error instanceof ApiError && state.error.status === 404;
    return (
      <div className="mx-auto flex w-full max-w-180 flex-col gap-6 pt-10 pb-30">
        <BackLink />
        <TilNotice
          message={
            notFound
              ? '글을 찾을 수 없어요. 삭제되었을 수 있어요.'
              : tilErrorMessage(state.error, 'TIL을 불러오지 못했어요.')
          }
        />
      </div>
    );
  }

  const { til, comments, me } = state.data;
  const author = til.author ?? {};
  const isOwner = isSameUser(me?.id, author.id);

  return (
    <div className="mx-auto flex w-full max-w-180 flex-col pt-10 pb-30">
      <BackLink />

      <article className="mt-6 flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-2 leading-[1.4]">
            <Badge tone="brand">{formatTilDate(til.createdAt)}</Badge>
            {isEdited(til) && <span className="text-xs font-medium text-[#9a99a8]">수정됨</span>}
          </div>

          <h1 className="text-[26px] leading-[1.3] font-bold wrap-anywhere text-[#1f1d2b] sm:text-[32px]">
            {til.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <TilAuthorTrigger
              author={author}
              dateLabel={formatTilDateTime(til.createdAt)}
              isMe={isOwner}
            />
            {isOwner && <TilOwnerActions tilId={tilId} />}
          </div>
        </header>

        <hr className="border-t border-[#ecebf2]" />

        <TilMarkdown source={til.body ?? ''} />
      </article>

      <div className="mt-16 flex flex-col gap-10">
        <TilReactions
          key={`reactions-${tilId}`}
          tilId={tilId}
          initialLiked={til.likedByMe ?? false}
          initialLikeCount={til.likeCount ?? 0}
          initialBookmarked={til.bookmarkedByMe ?? false}
        />

        <TilAuthorCard author={author} isMe={isOwner} />

        <TilCommentSection
          key={`comments-${tilId}`}
          tilId={tilId}
          postAuthorId={author.id}
          currentUser={me}
          initialComments={comments}
        />
      </div>
    </div>
  );
}
