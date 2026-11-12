type Props = {
  kind: 'posts' | 'reflections' | 'projects';
  label: string;
  value: number;
  description: string;
};

const paths = {
  posts: 'M6 3h12v18H6z M9 7h6 M9 11h6 M9 15h4',
  reflections: 'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3z M12 6v16',
  projects: 'M3 6h7l2 3h9v12H3z',
};

export default function ProfileStatCard({ kind, label, value, description }: Props) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl bg-white p-6">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-(--color-bg-brand-soft) text-(--color-text-brand)"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={paths[kind]} />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-xs text-(--color-text-muted)">{label}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-[28px] leading-8 font-bold text-(--color-text-primary)">{value}</p>
          <p className="text-xs text-(--color-text-muted)">{description}</p>
        </div>
      </div>
    </div>
  );
}
