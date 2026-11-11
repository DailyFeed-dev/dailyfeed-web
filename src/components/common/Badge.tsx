import type { ComponentProps } from 'react';

type BadgeTone = 'brand' | 'neutral' | 'success' | 'danger' | 'solid';

type BadgeProps = ComponentProps<'span'> & {
  /** brand · neutral · success · danger: 작은 상태 표시 · solid: 안 읽은 개수 (원형) */
  tone?: BadgeTone;
};

const TONE_CLASS: Record<BadgeTone, string> = {
  brand: 'rounded-[4px] bg-(--color-bg-brand-soft) text-(--color-text-brand)',
  neutral: 'rounded-[4px] bg-(--color-bg-subtle) text-(--color-text-secondary)',
  success: 'rounded-[4px] bg-(--color-bg-success-soft) text-(--color-text-success)',
  danger: 'rounded-[4px] bg-(--color-bg-danger-soft) text-(--color-text-danger)',
  // 한 자리 숫자도 원형이 되도록 최소 너비 = 높이(22px)
  solid: 'min-w-5.5 rounded-full bg-(--color-bg-brand) text-(--color-text-on-brand)',
};

/**
 * 공용 배지입니다. (Figma: 04 · 컴포넌트 · Badge)
 * 작성자, 날짜, 새 메시지 수, 완료/오류 같은 작은 상태를 표시합니다.
 * 숫자만 보여 줄 때는 aria-label 로 뜻을 알려 주세요. 예: aria-label="안 읽은 메시지 3개"
 *
 * @example <Badge tone="solid" aria-label="안 읽은 메시지 3개">3</Badge>
 */
export default function Badge({ tone = 'brand', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={`inline-flex shrink-0 items-center justify-center px-1.5 py-0.5 text-xs leading-normal font-semibold whitespace-nowrap ${TONE_CLASS[tone]} ${className ?? ''}`}
    />
  );
}
