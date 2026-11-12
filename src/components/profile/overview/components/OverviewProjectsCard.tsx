import type { Schemas } from '@/lib/api';

type Props = {
  projects: Schemas['ProjectResponse'][];
};

export default function OverviewProjectsCard({ projects }: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 sm:p-7" aria-labelledby="overview-projects-title">
      <h3 id="overview-projects-title" className="font-semibold">
        함께하는 프로젝트
      </h3>
      <p className="mt-2 text-sm text-(--color-text-muted)">프로젝트에서 나의 기록을 이어가세요.</p>
      {projects.length === 0 ? (
        <p className="mt-6 text-sm text-(--color-text-muted)">참여한 프로젝트가 없습니다.</p>
      ) : (
        <ul className="mt-4 divide-y divide-(--color-border-default)">
          {projects.map((project) => (
            <li key={project.id} className="flex min-w-0 items-center gap-4 py-5">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-brand-soft) text-(--color-text-brand)"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h7l2 3h9v12H3z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold wrap-anywhere">{project.name}</p>
                <p className="mt-1 text-xs wrap-anywhere text-(--color-text-muted)">
                  {project.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
