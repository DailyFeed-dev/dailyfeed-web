import ProfileErrorMessage from './ProfileErrorMessage';
import type { ProfileFormErrors } from './profileFormState';

import type { ChangeEvent } from 'react';

import type { Schemas } from '@/lib/api';

import ProfileAvatar from './ProfileAvatar';
import ProfileFormSection from './ProfileFormSection';

type ProfileAvatarFormProps = {
  errors?: ProfileFormErrors;
  profile: Schemas['AuthResponse'];
  previewUrl: string | null;
  isPending: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
};

export default function ProfileAvatarForm({
  errors = {},
  profile,
  previewUrl,
  isPending,
  isSubmitting,
  isDeleting,
  onFileChange,
  onDelete,
}: ProfileAvatarFormProps) {
  return (
    <ProfileFormSection
      title="프로필 사진"
      isPending={isPending}
      isSubmitting={isSubmitting}
      submitLabel="사진 저장"
      pendingLabel="저장 중..."
      secondaryAction={
        <button
          type="button"
          disabled={!profile.avatarUrl || isPending}
          onClick={onDelete}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          {isDeleting ? '삭제 중...' : '저장된 사진 삭제'}
        </button>
      }
    >
      <p className="text-sm text-zinc-600">
        파일 선택은 미리보기입니다. 사진 저장을 눌러야 반영됩니다.
      </p>
      {previewUrl && (
        <div>
          <p className="mb-2 text-sm text-zinc-600">선택한 사진 미리보기</p>
          <ProfileAvatar src={previewUrl} name={profile.name} />
        </div>
      )}
      <label className="block">
        <span className="text-sm font-medium">이미지 파일 선택</span>
        <input
          type="file"
          name="avatar"
          aria-invalid={Boolean(errors.avatar)}
          aria-describedby={errors.avatar ? 'profile-avatar-error' : undefined}
          accept="image/*"
          onChange={onFileChange}
          className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
        />
      </label>
      <ProfileErrorMessage id="profile-avatar-error" error={errors.avatar} />
    </ProfileFormSection>
  );
}
