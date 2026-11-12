import type { ReactNode } from 'react';

import Icon, { type IconName } from '@/components/common/Icon';

type ChatStateTone = 'brand' | 'danger';

type ChatStateIconProps = {
  name: IconName;
  tone?: ChatStateTone;
};

type ChatStateMessageProps = {
  visual: ReactNode;
  title: string;
  description?: string;
  detail?: string;
  children?: ReactNode;
  className?: string;
};

const TONE_CLASS: Record<ChatStateTone, string> = {
  brand: 'bg-(--color-bg-brand-soft) text-(--color-text-brand)',
  danger: 'bg-(--color-bg-danger-soft) text-(--color-text-danger)',
};

export function ChatStateIcon({ name, tone = 'brand' }: ChatStateIconProps) {
  return (
    <span className={`flex size-18 items-center justify-center rounded-full ${TONE_CLASS[tone]}`}>
      <Icon name={name} size={32} />
    </span>
  );
}

export default function ChatStateMessage({
  visual,
  title,
  description,
  detail,
  children,
  className,
}: ChatStateMessageProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 text-center leading-[1.45] ${className ?? ''}`}
    >
      {visual}
      <p className="text-lg font-semibold text-(--color-text-primary)">{title}</p>
      {description && (
        <p className="text-sm whitespace-pre-line text-(--color-text-secondary)">{description}</p>
      )}
      {detail && <p className="text-xs text-(--color-text-muted)">{detail}</p>}
      {children && <div className="mt-1 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
