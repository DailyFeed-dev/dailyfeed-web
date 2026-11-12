'use client';

import { useState } from 'react';

import { toggleTilBookmark, toggleTilLike } from '@/services/tilService';

import { TilIcon } from './TilTempUi';
import { tilErrorMessage } from './tilBoardUrl';

type Props = {
  tilId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  initialBookmarked: boolean;
};

const pillClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-full border py-3 text-[15px] leading-[1.4] font-semibold transition-colors disabled:cursor-default';
const offClass = 'border-[#e2defd] bg-white text-[#1f1d2b] hover:bg-[#f6f5fb]';
// 디자인: 켜진 상태는 1.5px 보라 테두리 (ring 으로 0.5px 더해 크기가 바뀌지 않게)
const onClass = 'border-[#685cf0] bg-[#f0eefe] text-[#4b3fd6] ring-[0.5px] ring-[#685cf0]';

/** 좋아요 · 저장 (디자인: Reactions 136:5046) */
export default function TilReactions({
  tilId,
  initialLiked,
  initialLikeCount,
  initialBookmarked,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState<'like' | 'bookmark' | null>(null);

  // API 가 토글(누를 때마다 반대로)이라, 응답이 올 때까지 같은 버튼을 막고 응답 값으로 맞춥니다.
  const toggleLike = async () => {
    if (pending) return;
    setPending('like');
    setLiked(!liked);
    setLikeCount((n) => Math.max(0, n + (liked ? -1 : 1)));
    try {
      const result = await toggleTilLike(tilId);
      // 응답에 값이 빠져 있으면 누른 결과(낙관적 값)를 그대로 둡니다.
      setLiked(result.liked ?? !liked);
      if (result.likeCount !== undefined) setLikeCount(result.likeCount);
    } catch (error) {
      setLiked(liked);
      setLikeCount((n) => Math.max(0, n + (liked ? 1 : -1)));
      window.alert(tilErrorMessage(error, '좋아요를 바꾸지 못했어요.'));
    } finally {
      setPending(null);
    }
  };

  const toggleBookmark = async () => {
    if (pending) return;
    setPending('bookmark');
    setBookmarked(!bookmarked);
    try {
      const result = await toggleTilBookmark(tilId);
      setBookmarked(result.bookmarked ?? !bookmarked);
    } catch (error) {
      setBookmarked(bookmarked);
      window.alert(tilErrorMessage(error, '저장하지 못했어요.'));
    } finally {
      setPending(null);
    }
  };

  return (
    <section
      aria-label="반응"
      className="flex flex-col items-center gap-4 rounded-2xl border border-[#e2defd] bg-white px-5 py-8"
    >
      <p className="text-base leading-[1.4] font-semibold text-[#1f1d2b]">
        이 TIL이 도움이 되었나요?
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          aria-pressed={liked}
          onClick={toggleLike}
          disabled={pending === 'like'}
          className={`${pillClass} pr-6 pl-5.5 ${liked ? onClass : offClass}`}
        >
          <TilIcon
            name="heart"
            className={liked ? 'fill-[#685cf0] text-[#685cf0]' : 'text-[#6b6a7b]'}
          />
          <span>좋아요</span>
          <span className={liked ? '' : 'text-[#6b6a7b]'}>{likeCount}</span>
        </button>
        <button
          type="button"
          aria-pressed={bookmarked}
          onClick={toggleBookmark}
          disabled={pending === 'bookmark'}
          className={`${pillClass} pr-5.5 pl-5 ${bookmarked ? onClass : offClass}`}
        >
          <TilIcon
            name="bookmark"
            strokeWidth={1.8}
            className={bookmarked ? 'fill-[#685cf0] text-[#685cf0]' : 'text-[#6b6a7b]'}
          />
          <span>{bookmarked ? '저장됨' : '저장'}</span>
        </button>
      </div>
    </section>
  );
}
