'use client';

import type { Schemas } from '@/lib/api';

import ProfileAvatarForm from './ProfileAvatarForm';
import ProfileErrorMessage from './ProfileErrorMessage';
import ProfileStatusForm from './ProfileStatusForm';
import { useProfileSettings } from './useProfileSettings';

// 기존에 분리하던 컴포넌트를 조합하고 이벤트를 연결하는 장소이다.

type ProfileSettingsProps = {
  profile: Schemas['AuthResponse'];
  onProfileChange: (profile: Schemas['AuthResponse']) => void;
};

export default function ProfileSettings({ profile, onProfileChange }: ProfileSettingsProps) {
  const { state, previewUrl, handleSubmit, handleFileChange, handleAvatarDelete } =
    useProfileSettings(onProfileChange);

  return (
    <div className="mt-6 space-y-8">
      <p className="text-sm text-zinc-600">이름과 이메일은 현재 조회만 제공합니다.</p>
      <ProfileErrorMessage id="profile-settings-error" error={state.errors.form} />
      {state.message && (
        <p role="status" className="text-sm text-green-700">
          {state.message}
        </p>
      )}

      <form onSubmit={(event) => handleSubmit('status', event)}>
        <ProfileStatusForm
          profile={profile}
          errors={state.errors}
          isPending={state.pending !== null}
          isSubmitting={state.pending === 'status'}
        />
      </form>
      <form onSubmit={(event) => handleSubmit('avatar', event)}>
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
    </div>
  );
}
