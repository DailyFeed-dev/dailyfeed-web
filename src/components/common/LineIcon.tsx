import type { ReactNode, SVGProps } from 'react';

/**
 * 선 아이콘 모음 (프로필 팝오버 · 친구 버튼 · 댓글 좋아요 · 더보기 메뉴)
 * SVG 경로는 디자인 시안 아이콘(TIL 아이콘과 동일)을 그대로 옮겼습니다. 색은 부모 글자색(currentColor)을 따릅니다.
 */

type IconDef = { viewBox: number; strokeWidth: number; paths: ReactNode };

const ICONS = {
  'user-plus': {
    viewBox: 18,
    strokeWidth: 1.5,
    paths: (
      <>
        <path d="M6.75 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M1.875 15a4.875 4.875 0 0 1 9.75 0M14.25 6v4.5M12 8.25h4.5" />
      </>
    ),
  },
  'user-check': {
    viewBox: 18,
    strokeWidth: 1.5,
    paths: (
      <>
        <path d="M6.75 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M1.875 15a4.875 4.875 0 0 1 9.75 0M12 8.25l1.5 1.5 3-3" />
      </>
    ),
  },
  chat: {
    viewBox: 18,
    strokeWidth: 1.9,
    paths: (
      <>
        <path d="M15.75 8.625a6.6 6.6 0 0 1-.823 3.084 6.4 6.4 0 0 1-5.292 3.184 6.5 6.5 0 0 1-3.11-.718L2.25 15.75l1.575-4.275a6.4 6.4 0 0 1-.674-2.734 6.3 6.3 0 0 1 .584-2.755A6.4 6.4 0 0 1 7.986 2.51a6.5 6.5 0 0 1 5.362 1.178 6.3 6.3 0 0 1 1.767 2.193 6.3 6.3 0 0 1 .635 2.744Z" />
        <path d="M6 8.625h.008M9 8.625h.008M12 8.625h.008" strokeWidth={2.4} />
      </>
    ),
  },
  heart: {
    viewBox: 22,
    strokeWidth: 1.8,
    paths: (
      <path d="M19.067 4.216a5.04 5.04 0 0 0-7.15 0L11 5.225l-.917-1.009a5.056 5.056 0 0 0-7.15 7.15l.917 1.009L11 19.25l7.15-6.875.917-1.009a5.04 5.04 0 0 0 0-7.15Z" />
    ),
  },
  more: {
    viewBox: 18,
    strokeWidth: 0,
    paths: (
      <g fill="currentColor" stroke="none">
        <circle cx="3.75" cy="9" r="1.2" />
        <circle cx="9" cy="9" r="1.2" />
        <circle cx="14.25" cy="9" r="1.2" />
      </g>
    ),
  },
} satisfies Record<string, IconDef>;

export type LineIconName = keyof typeof ICONS;

type LineIconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: LineIconName;
  /** px. 기본은 디자인 원본 크기 */
  size?: number;
};

export default function LineIcon({ name, size, ...props }: LineIconProps) {
  const icon: IconDef = ICONS[name];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? icon.viewBox}
      height={size ?? icon.viewBox}
      viewBox={`0 0 ${icon.viewBox} ${icon.viewBox}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={icon.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {icon.paths}
    </svg>
  );
}
