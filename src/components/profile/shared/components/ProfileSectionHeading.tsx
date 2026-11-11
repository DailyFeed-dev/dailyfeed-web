import type { ReactNode } from 'react';

type Props = { id: string; title: string; description: string; action?: ReactNode };

export default function ProfileSectionHeading({ id, title, description, action }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 id={id} className="text-[28px] leading-9 font-bold text-(--color-text-primary)">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-5 text-(--color-text-muted)">{description}</p>
      </div>
      {action}
    </div>
  );
}
