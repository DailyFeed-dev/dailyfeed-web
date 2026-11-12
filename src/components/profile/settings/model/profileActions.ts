import { updateMyStatus } from '@/services/profileService';

import type { ProfileActionResult } from './profileFormState';
import { validateProfileStatus } from './profileValidation';

// 에러를 반환하는 장소이다.

export async function submitProfileStatus(form: FormData): Promise<ProfileActionResult> {
  const result = validateProfileStatus(form);
  if (!result.ok) return result;

  const profile = await updateMyStatus(result.value);
  if (!profile) throw new Error('저장 응답을 확인하지 못했습니다. 새로고침해 확인해 주세요.');

  return { ok: true, profile, message: '상태를 저장했습니다.' };
}
