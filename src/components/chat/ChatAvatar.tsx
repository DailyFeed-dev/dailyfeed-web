'use client';

import Image from 'next/image';
import { useState } from 'react';

type ChatAvatarProps = {
  name: string;
  src: string | null;
  size: number;
};

export default function ChatAvatar({ name, src, size }: ChatAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
        className="flex shrink-0 items-center justify-center rounded-full bg-(--color-bg-brand-soft) font-semibold text-(--color-text-brand)"
      >
        {name.trim().slice(0, 1) || '?'}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      unoptimized
      onError={() => setFailedSrc(src)}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  );
}
