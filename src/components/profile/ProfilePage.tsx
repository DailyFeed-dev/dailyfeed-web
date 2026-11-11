'use client';

import { useEffect, useState } from 'react';

import { ApiError, type Schemas } from '@/lib/api';
import { getMyProfile } from '@/services/profileService';

import ProfileInfoPanel from './ProfileInfoPanel';
import ProfileSettings from './ProfileSettings';
import ProfileSummary from './ProfileSummary';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Schemas['AuthResponse'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'information' | 'settings'>('information');

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const result = await getMyProfile(controller.signal);

        if (!result) {
          throw new Error('내 정보 응답이 비어 있습니다.');
        }

        if (!controller.signal.aborted) {
          setProfile(result);
        }
      } catch (caught) {
        if (controller.signal.aborted) return;

        const message =
          caught instanceof ApiError && caught.status === 401
            ? '로그인이 필요합니다. 로그인 상태를 확인해 주세요.'
            : caught instanceof Error
              ? caught.message
              : '내 정보를 불러오지 못했습니다.';

        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <p className="py-8 text-zinc-700" role="status">
        내 정보를 불러오는 중입니다.
      </p>
    );
  }

  if (error || !profile) {
    return (
      <section className="py-8 text-zinc-900">
        <h1 className="text-2xl font-bold">내 프로필</h1>
        <p className="mt-4 text-red-700" role="alert">
          {error || '표시할 사용자 정보가 없습니다.'}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg border border-zinc-300 bg-white px-4 py-2"
        >
          다시 불러오기
        </button>
      </section>
    );
  }

  return (
    <section className="relative isolate flex-1 pt-6 pb-8 text-[#252438] before:fixed before:inset-0 before:-z-10 before:bg-[#F3F2F8]">
      <h1 className="sr-only">마이페이지</h1>
      <p className="mb-6 text-xs leading-4 text-[#77758A]">홈 / 마이페이지</p>
      <ProfileSummary profile={profile} onEdit={() => setView('settings')} />

      <nav aria-label="프로필 화면" className="mt-4 flex gap-6 border-b border-[#ECEAF4]">
        <button
          type="button"
          aria-pressed={view === 'information'}
          onClick={() => setView('information')}
          className={
            view === 'information'
              ? 'min-w-24 border-b-2 border-[#6157E9] px-3 py-4 text-sm font-semibold text-[#6157E9]'
              : 'min-w-24 border-b-2 border-transparent px-3 py-4 text-sm text-[#77758A]'
          }
        >
          내 정보
        </button>
        <button
          type="button"
          aria-pressed={view === 'settings'}
          onClick={() => setView('settings')}
          className={
            view === 'settings'
              ? 'min-w-24 border-b-2 border-[#6157E9] px-3 py-4 text-sm font-semibold text-[#6157E9]'
              : 'min-w-24 border-b-2 border-transparent px-3 py-4 text-sm text-[#77758A]'
          }
        >
          계정 설정
        </button>
      </nav>

      {view === 'information' ? (
        <ProfileInfoPanel profile={profile} onEdit={() => setView('settings')} />
      ) : (
        <section
          className="mt-8 rounded-2xl bg-white p-6 sm:p-7"
          aria-labelledby="profile-settings-title"
        >
          <h2 id="profile-settings-title" className="text-xl font-bold">
            계정 설정
          </h2>
          <p className="mt-2 text-sm text-zinc-500">사진과 상태를 관리합니다.</p>
          <ProfileSettings profile={profile} onProfileChange={setProfile} />
        </section>
      )}
    </section>
  );
}
