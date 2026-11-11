'use client';

import Link from 'next/link';
import { useId, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';

import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import { validateEmail, validateRequired } from '@/components/auth/validation';

type Field = 'email' | 'password';
type Errors = Partial<Record<Field, string>>;

// 화면에 놓인 순서입니다. 에러가 나면 이 순서대로 첫 번째 오류 칸에 포커스를 옮깁니다.
const FIELDS: Field[] = ['email', 'password'];

const VALIDATORS: Record<Field, (value: string) => string | undefined> = {
  email: validateEmail,
  // 로그인에서는 비밀번호 길이 규칙을 검사하지 않습니다. (회원가입에서 검사)
  password: (value) => validateRequired(value, '비밀번호를 입력해 주세요.'),
};

/**
 * 로그인 입력 폼입니다. 입력값·에러 상태를 다루므로 클라이언트 컴포넌트입니다.
 * 처음 제출할 때 전체를 검사하고, 그 뒤로는 값이 바뀔 때마다 해당 칸만 다시 검사합니다.
 */
export default function LoginForm() {
  const emailId = useId();
  const passwordId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<Record<Field, string>>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as Field;
    const { value } = event.target;

    setValues((prev) => ({ ...prev, [field]: value }));
    setShowNotice(false);
    if (submitted) setErrors((prev) => ({ ...prev, [field]: VALIDATORS[field](value) }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Errors = {};
    for (const field of FIELDS) nextErrors[field] = VALIDATORS[field](values[field]);
    setSubmitted(true);
    setErrors(nextErrors);

    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setShowNotice(false);
      const inputRef = firstInvalid === 'email' ? emailRef : passwordRef;
      inputRef.current?.focus();
      return;
    }

    // TODO(#4): authService.login 연결 (POST /api/v1/auth/login, skipAuth, tokenStorage.setTokens)
    // API 연결 전에는 로그인에 성공한 것처럼 처리하지 않고 안내 문구만 보여줍니다.
    setShowNotice(true);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-[25px]">
        <AuthInput
          ref={emailRef}
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          label="이메일"
          placeholder="이메일을 입력해 주세요"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <AuthInput
          ref={passwordRef}
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
      </div>

      <div className="mt-[21px] flex justify-end">
        <Link
          href="/forgot-password"
          className="text-[13px] leading-[19px] font-medium text-[#77748b] hover:underline"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>

      <AuthButton type="submit" className="mt-[30px]">
        로그인
      </AuthButton>

      {/* 스크린 리더가 문구 변화를 읽을 수 있도록 role="status" 영역은 항상 렌더링합니다. */}
      <div role="status">
        {showNotice && (
          <p className="mt-4 rounded-[10px] bg-(--auth-page-bg) px-4 py-3 text-center text-sm text-[#77748b]">
            로그인 기능은 아직 준비 중이에요.
          </p>
        )}
      </div>
    </form>
  );
}
