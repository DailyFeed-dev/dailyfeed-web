import type { Schemas } from '@/lib/api';

//프로필 설정에서 작업 종류, 진행 상태, 오류, 처리 결과의 데이터 형태를 정하는 코드

export type ProfileFormErrors = {
  presenceStatus?: string;
  statusMessage?: string;
  form?: string;
};

export type ProfileFormState = {
  isPending: boolean;
  errors: ProfileFormErrors;
  message: string;
};

export const initialProfileFormState: ProfileFormState = {
  isPending: false,
  errors: {},
  message: '',
};

export type ProfileValidationResult<T> =
  { ok: true; value: T } | { ok: false; errors: ProfileFormErrors };

export type ProfileActionResult =
  | { ok: true; message: string; profile: Schemas['AuthResponse'] }
  | { ok: false; errors: ProfileFormErrors };
