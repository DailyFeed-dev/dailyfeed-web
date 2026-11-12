import OverviewAccountCard from './components/OverviewAccountCard';
import OverviewProjectsCard from './components/OverviewProjectsCard';
import type { Schemas } from '@/lib/api';
import { getProfileActivity } from '@/services/profileService';

import ProfileResourceState from '../shared/components/ProfileResourceState';
import ProfileSectionHeading from '../shared/components/ProfileSectionHeading';
import ProfileStatCard from '../shared/components/ProfileStatCard';
import type { ProfileView } from '../profileActivity';
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
        description="게시판과 TIL에서 쌓은 기록을 확인하세요."
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
              description="일반 게시판 내 글"
            />
            <ProfileStatCard
              kind="reflections"
              label="학습 TIL"
              value={data.tilStats.totalTilCount ?? 0}
              description="나의 학습 기록"
            />
            <ProfileStatCard
              kind="projects"
              label="참여 프로젝트"
              value={data.projects.length}
              description="함께하는 프로젝트"
            />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <OverviewAccountCard profile={profile} onViewChange={onViewChange} />
            <OverviewProjectsCard projects={data.projects} />
          </div>
        </>
      )}
    </section>
  );
}
