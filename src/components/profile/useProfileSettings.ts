'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import type { Schemas } from '@/lib/api';

import { removeProfileAvatar, submitProfileAvatar, submitProfileStatus } from './profileActions';
import {
  initialProfileFormState,
  type ProfileAction,
  type ProfileActionResult,
  type ProfileFormState,
  type ProfileSubmitAction,
} from './profileFormState';

const submitActions = {
  status: submitProfileStatus,
  avatar: submitProfileAvatar,
};

export function useProfileSettings(onProfileChange: (profile: Schemas['AuthResponse']) => void) {
  const [state, setState] = useState<ProfileFormState>(initialProfileFormState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const locked = useRef(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function run(action: ProfileAction, work: () => Promise<ProfileActionResult>) {
    if (locked.current) return false;
    locked.current = true;
    setState({ ...initialProfileFormState, pending: action });

    try {
      const result = await work();
      if (!result.ok) {
        setState({ ...initialProfileFormState, errors: result.errors });
        return false;
      }

      if (result.profile) onProfileChange(result.profile);
      setState({ ...initialProfileFormState, message: result.message });
      return true;
    } catch (caught) {
      setState({
        ...initialProfileFormState,
        errors: { form: caught instanceof Error ? caught.message : '요청을 처리하지 못했습니다.' },
      });
      return false;
    } finally {
      locked.current = false;
    }
  }

  async function handleSubmit(action: ProfileSubmitAction, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const saved = await run(action, () => submitActions[action](new FormData(form)));

    if (saved && action === 'avatar') form.reset();
    if (saved && action === 'avatar') setPreviewUrl(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setPreviewUrl(file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
  }

  async function handleAvatarDelete() {
    await run('delete-avatar', removeProfileAvatar);
  }

  return { state, previewUrl, handleSubmit, handleFileChange, handleAvatarDelete };
}
