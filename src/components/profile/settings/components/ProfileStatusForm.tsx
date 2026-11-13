import { useState } from 'react';

import Dropdown from '@/components/common/Dropdown';
import type { Schemas } from '@/lib/api';

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
  const [presenceStatus, setPresenceStatus] = useState<string>(profile.presenceStatus || 'OFFLINE');

  return (
    <ProfileFormSection
      title="접속 상태와 상태 메시지"
      isPending={isPending}
      isSubmitting={isSubmitting}
      submitLabel="변경 저장"
      pendingLabel="저장 중..."
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="[&_[role=listbox]]:gap-1 [&_[role=option][aria-selected=false]>button:hover]:bg-[#F3F2F8]">
          <label
            htmlFor="profile-presence-status"
            className="mb-2 block text-[13px] font-medium text-(--color-text-primary)"
          >
            접속 상태
          </label>
          <Dropdown
            id="profile-presence-status"
            name="presenceStatus"
            options={presenceOptions}
            value={presenceStatus}
            onChange={setPresenceStatus}
            disabled={isPending}
            errorMessage={errors.presenceStatus}
          />
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
