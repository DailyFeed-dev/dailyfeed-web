import { deleteMyAvatar, updateMyStatus, uploadMyAvatar } from '@/services/profileService';

import type { ProfileActionResult } from './profileFormState';
import { validateProfileAvatar, validateProfileStatus } from './profileValidation';

// 에러를 반환하는 장소이다.

export async function submitProfileStatus(form: FormData): Promise<ProfileActionResult> {
  const result = validateProfileStatus(form);
  if (!result.ok) return result;

  const profile = await updateMyStatus(result.value);
  if (!profile) throw new Error('저장 응답을 확인하지 못했습니다. 새로고침해 확인해 주세요.');

  return { ok: true, profile, message: '상태를 저장했습니다.' };
}

export async function submitProfileAvatar(form: FormData): Promise<ProfileActionResult> {
  const result = validateProfileAvatar(form);
  if (!result.ok) return result;

  const profile = await uploadMyAvatar(result.value);
  if (!profile) throw new Error('저장 응답을 확인하지 못했습니다. 새로고침해 확인해 주세요.');

  return { ok: true, profile, message: '프로필 사진을 변경했습니다.' };
}

export async function removeProfileAvatar(): Promise<ProfileActionResult> {
  const profile = await deleteMyAvatar();
  if (!profile) throw new Error('삭제 응답을 확인하지 못했습니다. 새로고침해 확인해 주세요.');

  return {
    ok: true,
    profile,
    message: '저장된 프로필 사진을 삭제했습니다. 선택한 파일은 업로드 전까지 저장되지 않습니다.',
  };
}
