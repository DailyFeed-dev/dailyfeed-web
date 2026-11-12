import type { Schemas } from '@/lib/api';

import ProfileErrorMessage from './ProfileErrorMessage';
import ProfileFormField from './ProfileFormField';
import ProfileFormSection from './ProfileFormSection';
import type { ProfileFormErrors } from '../model/profileFormState';
import { presenceOptions } from '../../shared/model/profileOptions';

type ProfileStatusFormProps = {
  errors?: ProfileFormErrors;
  profile: Schemas['AuthResponse'];
  isPending: boolean;
  isSubmitting: boolean;
};

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
      submitLabel="변경 저장"
      pendingLabel="저장 중..."
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <label className="block">
            <span className="text-[13px] font-medium text-(--color-text-primary)">접속 상태</span>
            <select
              name="presenceStatus"
              defaultValue={profile.presenceStatus || 'OFFLINE'}
              aria-invalid={Boolean(errors.presenceStatus)}
              aria-describedby={errors.presenceStatus ? 'presence-status-error' : undefined}
              className="mt-2 w-full rounded-[10px] border border-(--color-border-default) bg-white px-3.5 py-3 text-sm text-(--color-text-secondary) focus:outline-2 focus:outline-(--color-border-brand)"
            >
              {presenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <ProfileErrorMessage id="presence-status-error" error={errors.presenceStatus} />
        </div>
        <ProfileFormField
          label="상태 메시지"
          name="statusMessage"
          type="text"
          defaultValue={profile.statusMessage || ''}
          maxLength={60}
          error={errors.statusMessage}
        />
      </div>
    </ProfileFormSection>
  );
}
