import type { CSSProperties } from 'react';

/**
 * 섹션 배경을 화면 양끝까지 칠하는 스타일.
 *
 * 레이아웃(main)은 최대 1440px · 내용 1280px 이라, 섹션 배경도 그 안에서 멈춰요.
 * 1920px 같은 넓은 화면에서도 배경이 끝까지 이어지도록, border-image 를 바깥(좌우 100vmax)까지 칠합니다.
 * - 박스 크기는 그대로라 내용 폭(1280)은 바뀌지 않아요.
 * - 그림만 바깥에 칠해서 가로 스크롤도 생기지 않아요. (100vw 를 쓰면 스크롤바 두께만큼 넘쳐요)
 *
 * @param image 칠할 배경. 단색이면 `linear-gradient(#F6F5FB 0 0)` 처럼 씁니다.
 */
export function fullBleedBackground(image: string): CSSProperties {
  return { borderImage: `${image} fill 0 / 0 / 0 100vmax` };
}

/** Figma bg/page (#F6F5FB) — 팀 색 변수에 아직 없어 값으로 적었어요. */
export const PAGE_BG = '#F6F5FB';
