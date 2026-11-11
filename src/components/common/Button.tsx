import type { ComponentProps } from 'react';

import Icon, { type IconName } from './Icon';

type ButtonVariant = 'primary' | 'soft' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-(--color-bg-brand) text-(--color-text-on-brand)',
  soft: 'bg-(--color-bg-brand-soft) text-(--color-text-brand)',
  outline:
    'border border-(--color-border-strong) bg-(--color-bg-surface) text-(--color-text-primary)',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export const BUTTON_ICON_SIZE: Record<ButtonSize, number> = { sm: 16, md: 16, lg: 20 };

export function buttonClassName({
  variant = 'primary',
  size = 'sm',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return `inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full leading-normal font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ''}`;
}

export default function Button({
  variant = 'primary',
  size = 'sm',
  icon,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button {...props} type={type} className={buttonClassName({ variant, size, className })}>
      {icon && <Icon name={icon} size={BUTTON_ICON_SIZE[size]} />}
      {children}
    </button>
  );
}
