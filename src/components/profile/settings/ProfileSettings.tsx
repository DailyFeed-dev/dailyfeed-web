'use client';

import { useEffect, useRef } from 'react';

import type { Schemas } from '@/lib/api';

import ProfileErrorMessage from './components/ProfileErrorMessage';
import ProfileStatusForm from './components/ProfileStatusForm';
import { useProfileSettings } from './hooks/useProfileSettings';

type ProfileSettingsProps = {
  profile: Schemas['AuthResponse'];
  isOpen: boolean;
  onProfileChange: (profile: Schemas['AuthResponse']) => void;
};
export default function ProfileSettings({
  profile,
  isOpen,
  onProfileChange,
}: ProfileSettingsProps) {
  const { state, handleSubmit } = useProfileSettings(onProfileChange);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen)
      formRef.current?.querySelector<HTMLButtonElement>('#profile-presence-status')?.focus();
  }, [isOpen]);

  return (
    <section
      id="profile-banner-editor"
      hidden={!isOpen}
      aria-labelledby="profile-settings-title"
      className="relative mt-6 rounded-2xl bg-white p-5 text-(--color-text-primary) sm:p-6"
    >
      <h3 id="profile-settings-title" className="mb-5 font-semibold">
        프로필 설정
      </h3>
      <ProfileErrorMessage id="profile-settings-error" error={state.errors.form} />
      {state.message && (
        <p role="status" className="mb-5 text-sm text-green-700">
          {state.message}
        </p>
      )}
      <form ref={formRef} aria-label="프로필 상태 설정" onSubmit={handleSubmit}>
        <ProfileStatusForm
          profile={profile}
          errors={state.errors}
          isPending={state.isPending}
          isSubmitting={state.isPending}
        />
      </form>
    </section>
  );
}
