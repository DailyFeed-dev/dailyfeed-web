'use client';

import { useState } from 'react';

import { getMyProfile } from '@/services/profileService';

import ProfileInfoPanel from './information/ProfileInfoPanel';
import ProfileOverview from './overview/ProfileOverview';
import ProfilePosts from './posts/ProfilePosts';
import ProfileReflections from './reflections/ProfileReflections';
import ProfileResourceState from './shared/components/ProfileResourceState';
import ProfileSettings from './settings/ProfileSettings';
import ProfileSummary from './shared/components/ProfileSummary';
import ProfileTabs from './shared/components/ProfileTabs';
import type { ProfileView } from './profileActivity';
import { useProfileResource } from './shared/hooks/useProfileResource';

export default function ProfilePage() {
  const [view, setView] = useState<ProfileView>('overview');
  const {
    data: profile,
    setData: setProfile,
    isLoading,
    error,
    retry,
  } = useProfileResource('profile', getMyProfile);

  if (!profile) return <ProfileResourceState isLoading={isLoading} error={error} onRetry={retry} />;

  return (
    <section className="relative isolate flex-1 pt-6 pb-8 text-(--color-text-primary) before:fixed before:inset-0 before:-z-10 before:bg-(--color-bg-subtle)">
      <h1 className="sr-only">마이페이지</h1>
      <p className="mb-6 text-xs leading-4 text-(--color-text-muted)">홈 / 마이페이지</p>
      <ProfileSummary
        profile={profile}
        showEdit={view !== 'settings'}
        onEdit={() => setView('settings')}
      />
      <ProfileTabs view={view} onChange={setView} />
      {view === 'overview' && <ProfileOverview profile={profile} onViewChange={setView} />}
      {view === 'information' && (
        <ProfileInfoPanel profile={profile} onEdit={() => setView('settings')} />
      )}
      {view === 'posts' && <ProfilePosts onViewChange={setView} />}
      {view === 'reflections' && <ProfileReflections />}
      {view === 'settings' && <ProfileSettings profile={profile} onProfileChange={setProfile} />}
      <footer className="mt-8 flex flex-wrap justify-between gap-3 text-xs text-(--color-text-muted)">
        <span>DailyFeed</span>
        <span>나의 기록, 나의 성장</span>
      </footer>
    </section>
  );
}
