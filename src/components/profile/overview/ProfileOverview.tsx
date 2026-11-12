import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import type { Schemas } from '@/lib/api';
import { getProfileActivity } from '@/services/profileService';

import ProfileInfoItem from '../shared/components/ProfileInfoItem';
import ProfileResourceState from '../shared/components/ProfileResourceState';
import ProfileSectionHeading from '../shared/components/ProfileSectionHeading';
import ProfileStatCard from '../shared/components/ProfileStatCard';
import type { ProfileView } from '../profileActivity';
import { accountLabels, platformLabels, roleLabels } from '../shared/model/profileOptions';
import { useProfileResource } from '../shared/hooks/useProfileResource';

type Props = { profile: Schemas['AuthResponse']; onViewChange: (view: ProfileView) => void };

// overview 화면을 보여주는 메뉴

export default function ProfileOverview({ profile, onViewChange }: Props) {
  const { data, isLoading, error, retry } = useProfileResource('activity', getProfileActivity);

  return (
    <section className="mt-8" aria-labelledby="profile-overview-title">
      <ProfileSectionHeading
        id="profile-overview-title"
        title="나의 활동을 한눈에"
        description="프로필과 프로젝트에서 쌓은 기록을 확인하세요."
      />
      {!data ? (
        <ProfileResourceState isLoading={isLoading} error={error} onRetry={retry} />
      ) : (
        <>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <ProfileStatCard
              kind="posts"
              label="작성한 게시글"
              value={data.postCount}
              description="프로젝트 게시글"
            />
            <ProfileStatCard
              kind="reflections"
              label="학습 회고"
              value={data.reflections.length}
              description="나의 성찰 기록"
            />
            <ProfileStatCard
              kind="projects"
              label="참여 프로젝트"
              value={data.projects.length}
              description="함께하는 프로젝트"
            />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <section
              className="rounded-2xl bg-white p-6 sm:p-7"
              aria-labelledby="overview-account-title"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id="overview-account-title" className="font-semibold">
                  내 계정 정보
                </h3>
                <Badge tone={profile.accountStatus === 'ACTIVE' ? 'success' : 'neutral'}>
                  {profile.accountStatus ? accountLabels[profile.accountStatus] : '상태 정보 없음'}
                </Badge>
              </div>
              <dl className="mt-4">
                <ProfileInfoItem label="이름" value={profile.name || '이름 미등록'} />
                <ProfileInfoItem label="이메일" value={profile.email || '이메일 미등록'} />
                <ProfileInfoItem
                  label="역할"
                  value={
                    [
                      profile.role && roleLabels[profile.role],
                      profile.platformRole && platformLabels[profile.platformRole],
                    ]
                      .filter(Boolean)
                      .join(' · ') || '역할 정보 없음'
                  }
                />
                <ProfileInfoItem
                  label="소속 조직 ID"
                  value={String(profile.companyId ?? '정보 없음')}
                />
              </dl>
              <Button
                variant="outline"
                className="mt-5 border-0"
                onClick={() => onViewChange('information')}
              >
                내 정보 보기 <span aria-hidden="true">→</span>
              </Button>
            </section>
            <section
              className="rounded-2xl bg-white p-6 sm:p-7"
              aria-labelledby="overview-projects-title"
            >
              <h3 id="overview-projects-title" className="font-semibold">
                함께하는 프로젝트
              </h3>
              <p className="mt-2 text-sm text-(--color-text-muted)">
                프로젝트에서 나의 기록을 이어가세요.
              </p>
              {data.projects.length === 0 ? (
                <p className="mt-6 text-sm text-(--color-text-muted)">
                  참여한 프로젝트가 없습니다.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-(--color-border-default)">
                  {data.projects.map((project) => (
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
                      <button
                        type="button"
                        onClick={() => onViewChange('posts')}
                        aria-label="내 게시글 화면으로 이동"
                        className="rounded-lg p-2 text-(--color-text-muted) focus-visible:outline-2"
                      >
                        <Icon name="chevron-down" className="-rotate-90" size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </section>
  );
}
