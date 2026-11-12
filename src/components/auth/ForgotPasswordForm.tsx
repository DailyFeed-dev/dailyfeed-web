'use client';

import { useRouter } from 'next/navigation';
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';

import { getAuthErrorMessage } from '@/components/auth/authErrorMessage';
import AuthFormError from '@/components/auth/AuthFormError';
import { resetEmailStorage } from '@/components/auth/resetEmailStorage';
import { validateEmail } from '@/components/auth/validation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { forgotPassword } from '@/services/authService';

/**
 * 비밀번호 찾기(04) 입력 폼입니다. 동작 방식은 LoginForm 과 같습니다.
 * 성공하면 입력한 이메일을 sessionStorage 에 저장해 두고 안내 화면(05)으로 이동합니다.
 */
export default function ForgotPasswordForm() {
  const router = useRouter();
  const emailId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  // 버튼이 disabled 로 다시 그려지기 전에 연달아 제출되는 것까지 막기 위한 표시입니다.
  const submittingRef = useRef(false);
  // 요청에 성공해 화면을 떠날 때만 폼을 비우기 위한 표시입니다. (LoginForm 과 같은 이유)
  const shouldResetRef = useRef(false);

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();

  // cacheComponents 때문에 떠난 화면이 숨겨진 채 남으므로, 성공 후 숨겨질 때 처음 상태로 되돌립니다.
  useLayoutEffect(() => {
    return () => {
      if (!shouldResetRef.current) return;
      shouldResetRef.current = false;
      submittingRef.current = false;
      setEmail('');
      setError(undefined);
      setSubmitted(false);
      setPending(false);
      setFormError(undefined);
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setEmail(value);
    setFormError(undefined);
    if (submitted) setError(validateEmail(value));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextError = validateEmail(email);
    setSubmitted(true);
    setError(nextError);
    if (nextError) {
      setFormError(undefined);
      emailRef.current?.focus();
      return;
    }

    submittingRef.current = true;
    setPending(true);
    setFormError(undefined);

    try {
      const trimmedEmail = email.trim();
      await forgotPassword({ email: trimmedEmail });
      // 새 비밀번호 설정(06)의 이메일 칸을 미리 채우는 데 씁니다.
      resetEmailStorage.set(trimmedEmail);
      shouldResetRef.current = true;
      router.push('/forgot-password/sent');
      return;
    } catch (submitError) {
      setFormError(getAuthErrorMessage(submitError));
    }

    submittingRef.current = false;
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-8">
      <Input
        ref={emailRef}
        id={emailId}
        name="email"
        type="email"
        autoComplete="email"
        label="이메일"
        placeholder="가입한 이메일을 입력해 주세요"
        value={email}
        onChange={handleChange}
        error={error}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending}
        className="mt-[51px] w-full"
      >
        {pending ? '보내는 중...' : '보안키 보내기'}
      </Button>

      <AuthFormError message={formError} />
    </form>
  );
}
