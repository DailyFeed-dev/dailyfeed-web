import Icon from '@/components/common/Icon';

type AttachmentCardProps = {
  name: string;
  meta: string;
  metaTone?: 'default' | 'danger';
  actionLabel?: string;
  onClick?: () => void;
  className?: string;
};

const CARD =
  'flex max-w-full min-w-0 items-center gap-3 rounded-[14px] border border-(--color-border-brand-soft) bg-(--color-bg-brand-soft) py-3 pr-4 pl-3 text-left';

export default function AttachmentCard({
  name,
  meta,
  metaTone = 'default',
  actionLabel,
  onClick,
  className = '',
}: AttachmentCardProps) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-(--color-bg-brand) text-(--color-text-on-brand)">
        <Icon name="file" size={20} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 leading-[1.45]">
        <span className="truncate text-sm font-semibold text-(--color-text-primary)">{name}</span>
        <span
          className={`text-xs ${
            metaTone === 'danger' ? 'text-(--color-text-danger)' : 'text-(--color-text-secondary)'
          }`}
        >
          {meta}
        </span>
        {actionLabel && <span className="sr-only">{actionLabel}</span>}
      </span>
    </>
  );

  if (!onClick) return <div className={`${CARD} ${className}`}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${CARD} cursor-pointer hover:border-(--color-border-brand) ${className}`}
    >
      {content}
    </button>
  );
}
