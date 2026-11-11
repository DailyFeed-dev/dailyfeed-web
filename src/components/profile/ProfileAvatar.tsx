'use client';

import Image from 'next/image';
import { useState } from 'react';

type ProfileAvatarProps = {
  src?: string;
  name?: string;
  size?: 'default' | 'summary';
};

export default function ProfileAvatar({ src, name, size = 'default' }: ProfileAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const sizeClass = size === 'summary' ? 'size-24 text-3xl' : 'size-20 text-2xl';

  if (!src || failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={`${name || '사용자'}의 기본 프로필 이미지`}
        className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#EFEDFF] font-semibold text-[#6157E9]`}
      >
        {name?.trim().slice(0, 1) || '?'}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${name || '사용자'}의 프로필 사진`}
      width={size === 'summary' ? 96 : 80}
      height={size === 'summary' ? 96 : 80}
      unoptimized
      onError={() => setFailedSrc(src)}
      className={`${sizeClass} shrink-0 rounded-full border-2 border-white object-cover`}
    ></Image>
  );
}
