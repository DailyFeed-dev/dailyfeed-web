import ProfileErrorMessage from './ProfileErrorMessage';
import type { ProfileFormErrors } from './profileFormState';

import type { Schemas } from '@/lib/api';

import ProfileFormField from './ProfileFormField';
import ProfileFormSection from './ProfileFormSection';
import { presenceOptions } from './profileOptions';

type ProfileStatusFormProps = {
  errors?: ProfileFormErrors;
  profile: Schemas['AuthResponse'];
  isPending: boolean;
  isSubmitting: boolean;
};

// 지금 접속 상태 및 상태 메시지를 확인하고 수정하는 폼

export default function ProfileStatusForm({
  errors = {},
  profile,
  isPending,
  isSubmitting,
}: ProfileStatusFormProps) {
  return (
    <ProfileFormSection
      title="접속 상태와 상태 메시지"
      isPending={isPending}
      isSubmitting={isSubmitting}
      submitLabel="상태 저장"
      pendingLabel="저장 중..."
    >
      <label className="block">
        <span className="text-sm font-medium">접속 상태</span>
        <select
          name="presenceStatus"
          aria-invalid={Boolean(errors.presenceStatus)}
          aria-describedby={errors.presenceStatus ? 'presence-status-error' : undefined}
          defaultValue={profile.presenceStatus || 'OFFLINE'}
          className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
        >
          {presenceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <ProfileErrorMessage id="presence-status-error" error={errors.presenceStatus} />
      <ProfileFormField
        label="상태 메시지"
        name="statusMessage"
        type="text"
        defaultValue={profile.statusMessage || ''}
        maxLength={60}
        error={errors.statusMessage}
      />
    </ProfileFormSection>
  );
}
