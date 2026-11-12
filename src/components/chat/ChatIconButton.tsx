import type { ComponentProps } from 'react';

import Icon, { type IconName } from '@/components/common/Icon';

type ChatIconButtonTone = 'brand' | 'soft' | 'outline';
type ChatIconButtonSize = 'sm' | 'md';

type ChatIconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> & {
  icon: IconName;
  label: string;
  tone?: ChatIconButtonTone;
  size?: ChatIconButtonSize;
};

const SIZE_CLASS: Record<ChatIconButtonSize, string> = { sm: 'size-8', md: 'size-10' };
const ICON_SIZE: Record<ChatIconButtonSize, number> = { sm: 18, md: 20 };

const TONE_CLASS: Record<ChatIconButtonTone, string> = {
  brand: 'bg-(--color-bg-brand) text-(--color-text-on-brand)',
  soft: 'bg-(--color-bg-brand-soft) text-(--color-text-brand)',
  outline:
    'border border-(--color-border-default) bg-(--color-bg-surface) text-(--color-text-secondary)',
};

export default function ChatIconButton({
  icon,
  label,
  tone = 'soft',
  size = 'sm',
  type = 'button',
  className,
  ...props
}: ChatIconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      className={`flex ${SIZE_CLASS[size]} shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) disabled:cursor-not-allowed disabled:opacity-40 ${TONE_CLASS[tone]} ${className ?? ''}`}
    >
      <Icon name={icon} size={ICON_SIZE[size]} />
    </button>
  );
}
