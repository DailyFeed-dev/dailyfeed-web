import type { ReactNode, SVGProps } from 'react';

/**
 * TIL 화면에서 쓰는 아이콘 모음입니다. (공통 Icon 에 없는 것만)
 * SVG 경로는 디자인 시안 public/icons 의 아이콘을 그대로 옮겼습니다.
 * 공통 Icon(components/common/Icon) 에 같은 아이콘이 추가되면 그쪽으로 바꿉니다.
 * 색은 부모 글자색(currentColor)을 따릅니다.
 */

type IconDef = { viewBox: number; strokeWidth: number; paths: ReactNode };

const ICONS = {
  // ---- 게시판 ----
  bookmark: {
    viewBox: 20,
    strokeWidth: 1.5,
    paths: (
      <path d="M15.833 17.5 10 13.333 4.167 17.5V4.167A1.667 1.667 0 0 1 5.833 2.5h8.334a1.667 1.667 0 0 1 1.666 1.667V17.5Z" />
    ),
  },
  'chevron-left': { viewBox: 16, strokeWidth: 1.333, paths: <path d="M10 12 6 8l4-4" /> },
  'chevron-right': { viewBox: 16, strokeWidth: 1.333, paths: <path d="m6 12 4-4-4-4" /> },
  comments: {
    viewBox: 18,
    strokeWidth: 1.35,
    paths: (
      <path d="M15.75 8.625a6.6 6.6 0 0 1-.823 3.084 6.4 6.4 0 0 1-5.292 3.184 6.5 6.5 0 0 1-3.11-.718L2.25 15.75l1.575-4.275a6.4 6.4 0 0 1-.674-2.734 6.3 6.3 0 0 1 .584-2.755A6.4 6.4 0 0 1 7.986 2.51a6.5 6.5 0 0 1 5.362 1.178 6.3 6.3 0 0 1 1.767 2.193 6.3 6.3 0 0 1 .635 2.744Z" />
    ),
  },
  'file-text': {
    viewBox: 18,
    strokeWidth: 1.35,
    paths: (
      <>
        <path d="M10.5 1.5h-6A1.5 1.5 0 0 0 3 3v12a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 15 15V6l-4.5-4.5Z" />
        <path d="M10.5 1.5V6H15M6 9.75h6M6 12.75h3.75" />
      </>
    ),
  },
  flame: {
    viewBox: 14,
    strokeWidth: 1.2,
    paths: (
      <path d="M7 12.833c2.333 0 4.083-1.575 4.083-3.966 0-2.275-1.516-3.617-2.566-5.075-.292 1.341-.992 2.1-1.75 2.391.116-1.925-.759-3.616-2.1-5.016.233 2.216-1.75 4.025-1.75 7.7 0 2.391 1.75 3.966 4.083 3.966Z" />
    ),
  },
  likes: {
    viewBox: 18,
    strokeWidth: 1.35,
    paths: (
      <path d="M15.6 3.45a4.12 4.12 0 0 0-5.85 0L9 4.275l-.75-.825A4.137 4.137 0 0 0 2.4 9.3l.75.825L9 15.75l5.85-5.625.75-.825a4.12 4.12 0 0 0 0-5.85Z" />
    ),
  },

  // ---- 상세 ----
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
  copy: {
    viewBox: 14,
    strokeWidth: 1.8,
    paths: (
      <>
        <rect x="4.958" y="4.958" width="7" height="7" rx="1.167" />
        <path d="M9.042 4.959v-1.75A1.167 1.167 0 0 0 7.875 2.04H3.208A1.167 1.167 0 0 0 2.042 3.21v4.666a1.167 1.167 0 0 0 1.166 1.167h1.75" />
      </>
    ),
  },
  check: { viewBox: 14, strokeWidth: 2.4, paths: <path d="m3.5 7.292 2.333 2.333L10.5 4.375" /> },
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
  pencil: {
    viewBox: 16,
    strokeWidth: 1.9,
    paths: (
      <>
        <path d="M2.667 13.333h2.666L12.667 6a1.886 1.886 0 0 0-2.667-2.667l-7.333 7.334v2.666Z" />
        <path d="M9 4.333 11.667 7" />
      </>
    ),
  },
  trash: {
    viewBox: 16,
    strokeWidth: 1.8,
    paths: (
      <path d="M2.667 4.667h10.666M6.667 7.333v4M9.333 7.333v4M4 4.667l.667 8a1.333 1.333 0 0 0 1.333 1.333h4a1.333 1.333 0 0 0 1.333-1.333l.667-8M6 4.667v-2h4v2" />
    ),
  },

  // ---- 작성 에디터 ----
  eye: {
    viewBox: 16,
    strokeWidth: 1.8,
    paths: (
      <>
        <path d="M1.333 8S3.733 3.333 8 3.333 14.667 8 14.667 8 12.267 12.667 8 12.667 1.333 8 1.333 8Z" />
        <circle cx="8" cy="8" r="2" />
      </>
    ),
  },
  'mode-text': { viewBox: 18, strokeWidth: 2, paths: <path d="M3 4.5h12M3 9h12M3 13.5h7.5" /> },
  'mode-markdown': {
    viewBox: 18,
    strokeWidth: 1.8,
    paths: (
      <>
        <rect x="1.875" y="4.125" width="14.25" height="9.75" rx="1.5" />
        <path
          d="M4.5 11.25v-4.5L6.375 9 8.25 6.75v4.5M11.625 6.75v4.125M10.125 9.6l1.5 1.5 1.5-1.5"
          strokeWidth={1.6}
        />
      </>
    ),
  },
  bold: {
    viewBox: 18,
    strokeWidth: 2.2,
    paths: (
      <path d="M5.25 9h4.5a2.625 2.625 0 0 0 0-5.25h-4.5V9Zm0 0h5.25a2.625 2.625 0 0 1 0 5.25H5.25V9Z" />
    ),
  },
  italic: {
    viewBox: 18,
    strokeWidth: 2,
    paths: <path d="M10.5 3.75h-3M10.5 14.25h-3M10.875 3.75l-3.75 10.5" />,
  },
  strike: {
    viewBox: 18,
    strokeWidth: 2,
    paths: (
      <path d="M3 9h12M12 5.625C11.55 4.425 10.425 3.75 9 3.75c-1.875 0-3 .975-3 2.25 0 .9.6 1.65 1.875 2.1M6 12.375c.45 1.2 1.575 1.875 3 1.875 1.875 0 3-.975 3-2.25 0-.45-.15-.825-.375-1.2" />
    ),
  },
  list: {
    viewBox: 18,
    strokeWidth: 2,
    paths: (
      <path d="M6.75 4.5H15M6.75 9H15M6.75 13.5H15M3.375 4.5h.008M3.375 9h.008M3.375 13.5h.008" />
    ),
  },
  todo: {
    viewBox: 18,
    strokeWidth: 1.8,
    paths: (
      <>
        <rect x="3" y="3" width="12" height="12" rx="2.25" />
        <path d="m6 9 2.25 2.25L12 6.75" />
      </>
    ),
  },
  quote: {
    viewBox: 18,
    strokeWidth: 1.8,
    paths: (
      <path d="M4.5 12.75h2.25l1.5-3v-4.5h-4.5v4.5H6l-1.5 3Zm6 0h2.25l1.5-3v-4.5h-4.5v4.5H12l-1.5 3Z" />
    ),
  },
  link: {
    viewBox: 18,
    strokeWidth: 1.8,
    paths: (
      <path d="M7.5 10.5a3 3 0 0 0 4.275 0l2.25-2.25a3.023 3.023 0 0 0-4.275-4.275L9 4.725M10.5 7.5a3 3 0 0 0-4.275 0l-2.25 2.25a3.023 3.023 0 0 0 4.275 4.275L9 13.275" />
    ),
  },
  code: {
    viewBox: 18,
    strokeWidth: 1.8,
    paths: <path d="M6 6 3 9l3 3M12 6l3 3-3 3M10.125 4.5l-2.25 9" />,
  },
} satisfies Record<string, IconDef>;

export type TilIconName = keyof typeof ICONS;

type TilIconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: TilIconName;
  /** px. 기본은 디자인 원본 크기 */
  size?: number;
};

/** TIL 아이콘. 색은 부모 글자색(currentColor)을 따릅니다. */
export function TilIcon({ name, size, ...props }: TilIconProps) {
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
