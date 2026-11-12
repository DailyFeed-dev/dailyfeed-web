import type { ChangeEvent } from 'react';

import Button, { buttonClassName } from '@/components/common/Button';
import type { Schemas } from '@/lib/api';

import ProfileAvatar from '../../shared/components/ProfileAvatar';
import ProfileErrorMessage from './ProfileErrorMessage';
import ProfileFormSection from './ProfileFormSection';
import type { ProfileFormErrors } from '../model/profileFormState';

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

//ProfileSettings, ProfileAvatarForm, ProfileFormSection, useProfileSettings, ProfileAvatar, ProfileErrorMessage
// 을 이용하여 사진을 그리고 오류를 보여주고 공통으로 처리했던 버튼 입력 잠금과 데이터와 함수전달 사진 선택, 미리보기 화면 구성까지 연결되어있다.

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
    >
      <div className="flex flex-wrap items-center gap-5">
        <ProfileAvatar src={previewUrl ?? profile.avatarUrl} name={profile.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`${buttonClassName({ variant: 'outline' })} relative focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--color-border-brand)`}
              style={{ borderRadius: 10 }}
            >
              이미지 변경
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={onFileChange}
                aria-invalid={Boolean(errors.avatar)}
                aria-describedby={errors.avatar ? 'profile-avatar-error' : undefined}
                className="sr-only"
              />
            </label>
            <Button
              variant="outline"
              disabled={!profile.avatarUrl || isPending}
              onClick={onDelete}
              aria-label="저장된 사진 삭제"
              className="border-0"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
          <p className="mt-3 text-xs leading-5 text-(--color-text-muted)">
            {previewUrl
              ? '선택한 사진 미리보기입니다. 사진 저장을 눌러 반영하세요.'
              : '나를 표현하는 프로필 이미지를 선택해 주세요.'}
          </p>
        </div>
      </div>
      <ProfileErrorMessage id="profile-avatar-error" error={errors.avatar} />
    </ProfileFormSection>
  );
}
