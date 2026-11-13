'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import { addTilComment, deleteTilComment, toggleTilCommentLike } from '@/services/tilService';
import type { Schemas } from '@/lib/api';

import TilAvatar from './TilAvatar';
import { TilProfilePopoverTrigger } from './TilProfilePopover';
import { TilIcon } from './TilTempUi';
import {
  formatTilRelativeTime,
  isSameUser,
  tilChatHref,
  tilDetailHref,
  tilErrorMessage,
  tilLoginHref,
} from './tilBoardUrl';

const MAX_LENGTH = 500;
const PAGE_SIZE = 3;

type Comment = Schemas['CommentResponse'];

const timeOf = (iso?: string) => (iso ? new Date(iso).getTime() : 0);

// 정렬 버튼 (왼쪽부터 순서대로). 전체는 오래된 순 — 대화가 이어진 순서대로 읽혀요.
const SORTS = {
  all: {
    label: '전체',
    compare: (a: Comment, b: Comment) => timeOf(a.createdAt) - timeOf(b.createdAt),
  },
  latest: {
    label: '최신순',
    compare: (a: Comment, b: Comment) => timeOf(b.createdAt) - timeOf(a.createdAt),
  },
  popular: {
    label: '인기순',
    compare: (a: Comment, b: Comment) => (b.likeCount ?? 0) - (a.likeCount ?? 0),
  },
} as const;
type Sort = keyof typeof SORTS;
const SORT_KEYS = Object.keys(SORTS) as Sort[];

type Props = {
  tilId: number;
  /** 글 작성자 id — 댓글 옆에 '작성자' 표시 */
  postAuthorId?: number;
  /** 로그인 안 했으면 null (입력창 대신 로그인 안내) */
  currentUser: Schemas['AuthorResponse'] | null;
  initialComments: Comment[];
};

const textareaClass =
  'w-full min-h-13 resize-none bg-transparent text-[15px] leading-[1.7] text-[#2e2d3a] outline-none field-sizing-content placeholder:text-[#a9a8b6]';

/** 댓글 (디자인: Comments 127:4520). 글만 쓸 수 있습니다. (마크다운 · 이미지 · 답글 X) */
export default function TilCommentSection({
  tilId,
  postAuthorId,
  currentUser,
  initialComments,
}: Props) {
  const [comments, setComments] = useState(initialComments);
  const [sort, setSort] = useState<Sort>('all');
  const [draft, setDraft] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [submitting, setSubmitting] = useState(false);
  const [likePending, setLikePending] = useState<number | null>(null);

  const sorted = useMemo(() => [...comments].sort(SORTS[sort].compare), [comments, sort]);

  const updateComment = (id: number, patch: Partial<Comment>) =>
    setComments((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const submit = async () => {
    const content = draft.trim();
    if (!content || submitting) return;
    setSubmitting(true);
    try {
      const created = await addTilComment(tilId, content);
      // 작성 응답에 작성자가 비어 있으면 로그인한 나로 채워요.
      // 그래야 새로고침 없이도 이름 · 사진과 '작성자' 표시(글쓴이가 단 댓글)가 바로 보여요.
      const withAuthor =
        created.author?.id === undefined && currentUser
          ? { ...created, author: currentUser }
          : created;
      setComments((list) => [...list, withAuthor]);
      // 전체(오래된 순)에서는 새 댓글이 맨 끝에 붙어서, 방금 쓴 댓글까지 펼쳐 보여 줘요.
      // 다른 정렬에서는 보고 있던 댓글이 밀려 사라지지 않게 한 칸만 늘려요.
      setVisible((n) => (sort === 'all' ? Math.max(n, comments.length) + 1 : n + 1));
      setDraft('');
    } catch (error) {
      window.alert(tilErrorMessage(error, '댓글을 작성하지 못했어요.'));
    } finally {
      setSubmitting(false);
    }
  };

  // API 가 토글이라, 응답이 올 때까지 같은 댓글의 좋아요를 막고 응답 값으로 맞춥니다.
  const toggleLike = async (target: Comment) => {
    const id = target.id;
    if (id === undefined || likePending !== null) return;
    const liked = target.likedByMe ?? false;
    const count = target.likeCount ?? 0;
    setLikePending(id);
    updateComment(id, { likedByMe: !liked, likeCount: Math.max(0, count + (liked ? -1 : 1)) });
    try {
      const result = await toggleTilCommentLike(tilId, id);
      updateComment(id, {
        likedByMe: result.liked ?? !liked,
        likeCount: result.likeCount ?? Math.max(0, count + (liked ? -1 : 1)),
      });
    } catch (error) {
      updateComment(id, { likedByMe: liked, likeCount: count });
      window.alert(tilErrorMessage(error, '좋아요를 바꾸지 못했어요.'));
    } finally {
      setLikePending(null);
    }
  };

  const remove = async (target: Comment) => {
    const id = target.id;
    if (id === undefined || !window.confirm('이 댓글을 삭제할까요?')) return;
    try {
      await deleteTilComment(tilId, id);
      setComments((list) => list.filter((c) => c.id !== id));
    } catch (error) {
      window.alert(tilErrorMessage(error, '댓글을 삭제하지 못했어요.'));
    }
  };

  const renderComment = (c: Comment) => {
    const author = c.author ?? {};
    // 내 댓글이면 프로필 팝오버를 열지 않습니다.
    const isMine = isSameUser(author.id, currentUser?.id);
    return (
      <article key={c.id} className="flex items-start gap-3.5 border-b border-[#ecebf2] py-5">
        <TilProfilePopoverTrigger
          disabled={isMine}
          profile={author}
          userId={author.id}
          chatHref={tilChatHref(author.id)}
          triggerClassName="rounded-full"
        >
          <TilAvatar name={author.name} src={author.avatarUrl} size={36} color="#1f1d2b" />
        </TilProfilePopoverTrigger>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <header className="flex items-center gap-2 leading-[1.4]">
            <TilProfilePopoverTrigger
              disabled={isMine}
              profile={author}
              userId={author.id}
              chatHref={tilChatHref(author.id)}
              triggerClassName="group"
            >
              <span className="text-sm font-semibold text-[#1f1d2b] underline-offset-2 group-hover:underline">
                {author.name}
              </span>
            </TilProfilePopoverTrigger>
            {isSameUser(author.id, postAuthorId) && <Badge tone="brand">작성자</Badge>}
            <span className="text-[13px] text-[#9a99a8]">{formatTilRelativeTime(c.createdAt)}</span>

            {/* 내 댓글만 메뉴(삭제)를 보여줍니다. */}
            {isMine && (
              <details className="relative ml-auto">
                <summary
                  aria-label="댓글 메뉴"
                  className="inline-flex cursor-pointer list-none rounded text-[#9a99a8] hover:bg-[#f6f5fb] [&::-webkit-details-marker]:hidden"
                >
                  <TilIcon name="more" />
                </summary>
                <div className="absolute top-[calc(100%+4px)] right-0 z-10 min-w-24 rounded-xl border border-[#f0eff5] bg-white p-1.5 shadow-[0_12px_32px_rgba(31,28,43,0.12)]">
                  <button
                    type="button"
                    onClick={() => remove(c)}
                    className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-[#e5484d] hover:bg-[#fff5f5]"
                  >
                    삭제
                  </button>
                </div>
              </details>
            )}
          </header>

          <p className="text-[15px] leading-[1.7] wrap-anywhere whitespace-pre-wrap text-[#2e2d3a]">
            {c.content}
          </p>

          <div className="flex items-center gap-4 pt-0.5 text-[13px] leading-[1.4] font-medium">
            <button
              type="button"
              aria-pressed={c.likedByMe}
              aria-label={`좋아요 ${c.likeCount ?? 0}`}
              onClick={() => toggleLike(c)}
              disabled={likePending === c.id}
              className={`inline-flex cursor-pointer items-center gap-1 disabled:cursor-default ${
                c.likedByMe ? 'text-[#4b3fd6]' : 'text-[#6b6a7b] hover:text-[#1f1d2b]'
              }`}
            >
              <TilIcon
                name="heart"
                size={16}
                className={c.likedByMe ? 'fill-[#685cf0] text-[#685cf0]' : ''}
              />
              <span>{c.likeCount ?? 0}</span>
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section aria-label="댓글" className="flex w-full flex-col">
      <div className="flex items-center justify-between pb-4 leading-[1.4]">
        <h2 className="text-xl font-bold text-[#1f1d2b]">
          댓글 <span className="ml-0.5 text-[#685cf0]">{comments.length}</span>
        </h2>
        <div role="radiogroup" aria-label="정렬" className="flex gap-3">
          {SORT_KEYS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={sort === s}
              onClick={() => setSort(s)}
              className={`cursor-pointer text-[13px] leading-[1.4] ${
                sort === s ? 'font-semibold text-[#1f1d2b]' : 'font-medium text-[#9a99a8]'
              }`}
            >
              {SORTS[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* 댓글 입력 (로그인해야 쓸 수 있어요) */}
      {currentUser ? (
        <div className="flex items-start gap-3.5 pb-3">
          <TilAvatar
            name={currentUser.name}
            src={currentUser.avatarUrl}
            size={36}
            color="#1f1d2b"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border-[1.5px] border-[#e2defd] bg-white pt-4 pr-3 pb-3 pl-4.5 transition-[border-color,box-shadow] focus-within:border-[#685cf0] focus-within:shadow-[0_0_0_4px_rgba(105,92,240,0.12)]">
            <textarea
              value={draft}
              maxLength={MAX_LENGTH}
              placeholder="이 TIL에 대한 생각이나 질문을 남겨주세요"
              aria-label="댓글 입력"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit();
              }}
              className={textareaClass}
            />
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs leading-[1.4] font-medium text-[#9a99a8]">
                {draft.length} / {MAX_LENGTH}
              </span>
              <Button size="md" onClick={submit} disabled={!draft.trim() || submitting}>
                댓글 작성
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mb-3 rounded-xl border-[1.5px] border-[#e2defd] bg-white px-4.5 py-4 text-[15px] text-[#6b6a7b]">
          댓글을 쓰려면{' '}
          <Link
            href={tilLoginHref(tilDetailHref(tilId))}
            className="font-semibold text-[#4b3fd6] underline underline-offset-2"
          >
            로그인
          </Link>
          해 주세요.
        </p>
      )}

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#9a99a8]">첫 댓글을 남겨 보세요.</p>
      ) : (
        sorted.slice(0, visible).map(renderComment)
      )}

      {sorted.length > visible && (
        <div className="flex justify-center pt-5">
          <Button variant="outline" size="md" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
            댓글 더보기
            <Icon name="chevron-down" size={16} />
          </Button>
        </div>
      )}
    </section>
  );
}
