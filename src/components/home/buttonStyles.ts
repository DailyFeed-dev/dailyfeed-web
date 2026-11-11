/**
 * 04 · Button 값 그대로 (임시).
 * TODO(common): 공통 Button 컴포넌트가 생기면 이 파일을 지우고 교체합니다.
 * Size L: 여백 14/24 · 16 SemiBold(Title/M) · radius/full
 */
const BASE_L =
  'inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[16px] leading-[1.5] font-semibold transition-colors';

export const buttonL = {
  /** Variant=Primary: bg/brand · text/on-brand */
  primary: `${BASE_L} bg-[#6157E9] text-[#FFFFFF] hover:bg-[#4B3FD6]`,
  /** Variant=Outline: bg/surface · border/strong · text/primary */
  outline: `${BASE_L} border border-[#DFDDE8] bg-[#FFFFFF] text-[#1F1D2B] hover:border-[#6157E9]`,
  /** Variant=Soft: bg/brand-soft · text/brand */
  soft: `${BASE_L} bg-[#F0EEFE] text-[#4B3FD6] hover:bg-[#E2DEFD]`,
} as const;
