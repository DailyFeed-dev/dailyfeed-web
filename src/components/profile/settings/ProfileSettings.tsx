'use client';

import type { Schemas } from '@/lib/api';

import ProfileAvatarForm from './components/ProfileAvatarForm';
import ProfileErrorMessage from './components/ProfileErrorMessage';
import ProfileSectionHeading from '../shared/components/ProfileSectionHeading';
import ProfileStatusForm from './components/ProfileStatusForm';
import { useProfileSettings } from './hooks/useProfileSettings';

type ProfileSettingsProps = {
  profile: Schemas['AuthResponse'];
  onProfileChange: (profile: Schemas['AuthResponse']) => void;
};
// 계정 설정 화면 구성 및 각 입력 화면에 동작을 연결하는 컴포넌트
export default function ProfileSettings({ profile, onProfileChange }: ProfileSettingsProps) {
  const { state, previewUrl, handleSubmit, handleFileChange, handleAvatarDelete } =
    useProfileSettings(onProfileChange);

  return (
    <section className="mt-8" aria-labelledby="profile-settings-title">
      <ProfileSectionHeading
        id="profile-settings-title"
        title="프로필과 계정 설정"
        description="나를 표현하는 프로필 사진과 접속 상태를 관리하세요."
      />
      <div className="mt-6 max-w-188 rounded-2xl bg-white p-6 sm:p-7">
        <h3 className="mb-6 font-semibold text-(--color-text-primary)">프로필 설정</h3>
        <ProfileErrorMessage id="profile-settings-error" error={state.errors.form} />
        {state.message && (
          <p role="status" className="mb-5 text-sm text-green-700">
            {state.message}
          </p>
        )}
        <form aria-label="프로필 사진 설정" onSubmit={(event) => handleSubmit('avatar', event)}>
          <ProfileAvatarForm
            profile={profile}
            previewUrl={previewUrl}
            errors={state.errors}
            isPending={state.pending !== null}
            isSubmitting={state.pending === 'avatar'}
            isDeleting={state.pending === 'delete-avatar'}
            onFileChange={handleFileChange}
            onDelete={handleAvatarDelete}
          />
        </form>
        <form
          aria-label="프로필 상태 설정"
          className="mt-6 border-t border-(--color-border-default) pt-6"
          onSubmit={(event) => handleSubmit('status', event)}
        >
          <ProfileStatusForm
            profile={profile}
            errors={state.errors}
            isPending={state.pending !== null}
            isSubmitting={state.pending === 'status'}
          />
        </form>
      </div>
    </section>
  );
}
