/**
 * 버튼에 마우스를 올렸을 때 "누를 수 있다"는 느낌을 주는 효과.
 *
 * 공통 Button(buttonClassName)은 그대로 두고, buttonClassName 의 className 으로 더해서 씁니다.
 *   예) buttonClassName({ variant: 'outline', size: 'lg', className: buttonHover.outline })
 *
 * - 배경색이 버튼 전체에서 한 번에 한 단계 진해져요. (디자인 시스템의 바로 옆 단계 색)
 * - 테두리 색도 같이 바뀌어서 가장자리에 흰 선이 남지 않아요.
 * - 살짝(2px) 떠오르고 그림자가 생기며, 누르는 순간에는 다시 내려앉아요.
 * - "동작 줄이기" 사용자에게는 색만 바뀌고 움직이지 않아요.
 */
const BASE =
  'transition-[background-color,border-color,translate,box-shadow] duration-200 ease-out ' +
  'hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(31,29,43,0.16)] ' +
  'active:translate-y-0 active:shadow-none ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0';

export const buttonHover = {
  /** Outline(흰색) → bg/brand-soft, 테두리 border/brand-soft */
  outline: `${BASE} hover:border-(--color-border-brand-soft) hover:bg-(--color-bg-brand-soft)`,
  /**
   * 누를 수 있는 카드(채팅 · FAQ 바로가기): 연보라 바탕 → bg/brand-soft, 테두리 border/brand-soft
   * 키보드로 이동했을 때도 보라 테두리로 표시돼요.
   */
  card: `${BASE} hover:border-(--color-border-brand-soft) hover:bg-(--color-bg-brand-soft) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand)`,
} as const;
