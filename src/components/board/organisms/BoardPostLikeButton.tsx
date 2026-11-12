'use client';

import { useState } from 'react';
import LineIcon from '@/components/common/LineIcon';
import { useApiData } from '@/hooks/useApiData';
import { ApiError } from '@/lib/api';
import { getPostLikedByMe, togglePostLike } from '@/services/postService';

// TIL 반응 버튼(Reactions 136:5046)과 같은 모양: 꺼짐은 흰 배경, 켜지면 보라 테두리와 연보라 배경
const pillClass =
  'inline-flex cursor-pointer items-center gap-2 rounded-full border py-3 pr-6 pl-5.5 text-[15px] leading-[1.4] font-semibold transition-colors disabled:cursor-default';
const offClass = 'border-[#e2defd] bg-white text-[#1f1d2b] hover:bg-[#f6f5fb]';
// 켜진 상태는 1.5px 보라 테두리 (ring 으로 0.5px 더해 크기가 바뀌지 않게)
const onClass = 'border-[#685cf0] bg-[#f0eefe] text-[#4b3fd6] ring-[0.5px] ring-[#685cf0]';

// 글 좋아요 버튼 — 내가 이미 눌렀는지는 별도 API 로 가져오고(로그인하지 않았으면 꺼진 상태), 누르면 바로 바꿨다가 서버 응답으로 맞춥니다.
export default function BoardPostLikeButton({
  postId,
  initialLikeCount,
}: {
  postId: number;
  initialLikeCount: number;
}) {
  const likedByMe = useApiData(`post-liked:${postId}`, (signal) =>
    getPostLikedByMe(postId, signal).then((result) => result.liked === true),
  );
  // 누른 결과(null 이면 아직 안 눌러서 서버에서 받은 값을 씁니다)
  const [override, setOverride] = useState<{ liked: boolean; count: number } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liked = override?.liked ?? likedByMe.data ?? false;
  const count = override?.count ?? initialLikeCount;

  // API 가 토글(누를 때마다 반대로)이라, 응답이 올 때까지 버튼을 막고 응답 값으로 맞춥니다.
  async function handleToggle() {
    if (pending) return;
    setPending(true);
    setError(null);
    setOverride({ liked: !liked, count: Math.max(0, count + (liked ? -1 : 1)) });
    try {
      const result = await togglePostLike(postId);
      setOverride({
        liked: result.liked ?? !liked,
        count: result.likeCount ?? Math.max(0, count + (liked ? -1 : 1)),
      });
    } catch (e) {
      setOverride({ liked, count });
      setError(
        e instanceof ApiError
          ? e.status === 401
            ? '로그인이 필요해요.'
            : e.message
          : '좋아요를 바꾸지 못했어요.',
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        aria-pressed={liked}
        onClick={handleToggle}
        disabled={pending}
        className={`${pillClass} ${liked ? onClass : offClass}`}
      >
        <LineIcon
          name="heart"
          className={liked ? 'fill-[#685cf0] text-[#685cf0]' : 'text-[#6b6a7b]'}
        />
        <span>좋아요</span>
        <span className={liked ? '' : 'text-[#6b6a7b]'}>{count}</span>
      </button>
      {error && (
        <p role="alert" className="text-xs leading-[1.55] text-[#D41717]">
          {error}
        </p>
      )}
    </div>
  );
}
