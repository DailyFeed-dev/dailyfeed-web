import type { CSSProperties } from 'react';

/** px. 디자인에서 쓰는 크기만 둡니다. (카드 28, 위젯 32, 작성자 40, 작성자 카드 64, 팝오버 72) */
export type AvatarSize = 24 | 28 | 32 | 36 | 40 | 48 | 64 | 72;

const FONT_SIZE: Record<AvatarSize, number> = {
  24: 11,
  28: 12,
  32: 13,
  36: 14,
  40: 15,
  48: 16,
  64: 22,
  72: 22,
};

type Props = {
  /** 이름 (사진이 없을 때 첫 글자를 보여줍니다) */
  name?: string;
  /** 프로필 사진 URL. 있으면 이니셜 대신 사진을 보여줍니다. */
  src?: string;
  size?: AvatarSize;
  /** 배경색 (기본: 연보라) */
  background?: string;
  /** 이니셜 글자색 (기본: 브랜드 보라) */
  color?: string;
  className?: string;
};

/** 원형 아바타. 사진이 없으면 이름 첫 글자를 보여줍니다. (디자인: Avatar 207:6170) */
export default function Avatar({
  name = '',
  src,
  size = 40,
  background = '#e2defd',
  color = '#4b3fd6',
  className,
}: Props) {
  const style: CSSProperties = {
    width: size,
    height: size,
    fontSize: FONT_SIZE[size],
    background,
    color,
  };

  return (
    <span
      aria-hidden={src ? undefined : true}
      style={style}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full leading-[1.4] whitespace-nowrap ${
        size >= 64 ? 'font-bold' : 'font-semibold'
      } ${className ?? ''}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- 사용자 프로필 사진(외부 URL)
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        name.trim().slice(0, 1) || '?'
      )}
    </span>
  );
}
