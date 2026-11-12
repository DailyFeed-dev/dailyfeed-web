'use client';

import { useRef, useState, type FormEvent } from 'react';

import type { Schemas } from '@/lib/api';

import { submitProfileStatus } from '../model/profileActions';
import { initialProfileFormState, type ProfileFormState } from '../model/profileFormState';

export function useProfileSettings(onProfileChange: (profile: Schemas['AuthResponse']) => void) {
  const [state, setState] = useState<ProfileFormState>(initialProfileFormState);
  const locked = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    locked.current = true;
    setState({ ...initialProfileFormState, isPending: true });

    try {
      const result = await submitProfileStatus(new FormData(event.currentTarget));
      if (!result.ok) {
        setState({ ...initialProfileFormState, errors: result.errors });
        return;
      }

      onProfileChange(result.profile);
      setState({ ...initialProfileFormState, message: result.message });
    } catch (caught) {
      setState({
        ...initialProfileFormState,
        errors: { form: caught instanceof Error ? caught.message : '요청을 처리하지 못했습니다.' },
      });
    } finally {
      locked.current = false;
    }
  }

  return { state, handleSubmit };
}
