import type { ComponentProps } from 'react';

type BadgeTone = 'brand' | 'neutral' | 'success' | 'danger' | 'solid';

type BadgeProps = ComponentProps<'span'> & {
  tone?: BadgeTone;
};

const TONE_CLASS: Record<BadgeTone, string> = {
  brand: 'rounded-[4px] bg-(--color-bg-brand-soft) text-(--color-text-brand)',
  neutral: 'rounded-[4px] bg-(--color-bg-subtle) text-(--color-text-secondary)',
  success: 'rounded-[4px] bg-(--color-bg-success-soft) text-(--color-text-success)',
  danger: 'rounded-[4px] bg-(--color-bg-danger-soft) text-(--color-text-danger)',
  solid: 'min-w-5.5 rounded-full bg-(--color-bg-brand) text-(--color-text-on-brand)',
};

export default function Badge({ tone = 'brand', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={`inline-flex shrink-0 items-center justify-center px-1.5 py-0.5 text-xs leading-normal font-semibold whitespace-nowrap ${TONE_CLASS[tone]} ${className ?? ''}`}
    />
  );
}
