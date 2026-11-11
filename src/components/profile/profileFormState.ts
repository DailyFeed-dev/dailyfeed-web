import type { Schemas } from '@/lib/api';

export type ProfileSubmitAction = 'status' | 'avatar';
export type ProfileAction = ProfileSubmitAction | 'delete-avatar';

export type ProfileFormErrors = {
  presenceStatus?: string;
  statusMessage?: string;
  avatar?: string;
  form?: string;
};

export type ProfileFormState = {
  pending: ProfileAction | null;
  errors: ProfileFormErrors;
  message: string;
};

export const initialProfileFormState: ProfileFormState = {
  pending: null,
  errors: {},
  message: '',
};

export type ProfileValidationResult<T> =
  { ok: true; value: T } | { ok: false; errors: ProfileFormErrors };

export type ProfileActionResult =
  | { ok: true; message: string; profile?: Schemas['AuthResponse'] }
  | { ok: false; errors: ProfileFormErrors };
