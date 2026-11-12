import { useId, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';

import { getAuthErrorMessage } from '@/components/auth/authErrorMessage';
import AuthFormError from '@/components/auth/AuthFormError';
import {
  PASSWORD_MIN_LENGTH,
  validateEmail,
  validateNewPassword,
  validatePasswordConfirm,
  validateRequired,
} from '@/components/auth/validation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ApiError } from '@/lib/api';
import { sendEmailCode } from '@/services/authService';

type Field = 'nickname' | 'email' | 'password' | 'passwordConfirm';
export type SignupDetails = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

// 화면에 놓인 순서입니다. 에러가 나면 이 순서대로 첫 번째 오류 칸에 포커스를 옮깁니다.
const FIELDS: Field[] = ['nickname', 'email', 'password', 'passwordConfirm'];

// 비밀번호 확인 칸은 비밀번호와 비교해야 해서 입력값 전체를 받습니다.
const VALIDATORS: Record<Field, (values: SignupDetails) => string | undefined> = {
  nickname: (values) => validateRequired(values.nickname, '닉네임을 입력해 주세요.'),
  email: (values) => validateEmail(values.email),
  password: (values) => validateNewPassword(values.password, '비밀번호를 입력해 주세요.'),
  passwordConfirm: (values) =>
    validatePasswordConfirm(
      values.passwordConfirm,
      values.password,
      '비밀번호를 다시 입력해 주세요.',
    ),
};

const DUPLICATE_EMAIL_MESSAGE = '이미 가입된 이메일이에요.';

type SignupDetailsFormProps = {
  /** 입력값은 SignupFlow 가 갖고 있습니다. 2단계에서 돌아왔을 때도 남아 있게 하기 위해서입니다. */
  values: SignupDetails;
  onChange: (values: SignupDetails) => void;
  /** true 면 화면에 나타날 때 첫 입력칸(닉네임)에 포커스를 둡니다. (2단계에서 돌아온 경우) */
  autoFocusFirstField: boolean;
  /** 인증번호 메일 발송에 성공하면 부릅니다. */
  onCodeSent: () => void;
};

/**
 * 회원가입 1단계(Figma 02) 폼입니다. 검사 시점·포커스·중복 제출 방지는 LoginForm 과 같습니다.
 * SignupFlow('use client') 안에서만 쓰여 클라이언트 컴포넌트로 동작합니다.
 * (함수 props 를 받으므로 이 파일에는 'use client' 를 붙이지 않습니다)
 */
export default function SignupDetailsForm({
  values,
  onChange,
  autoFocusFirstField,
  onCodeSent,
}: SignupDetailsFormProps) {
  const nicknameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();
  const nicknameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  // 버튼이 disabled 로 다시 그려지기 전에 연달아 제출되는 것까지 막기 위한 표시입니다.
  const submittingRef = useRef(false);

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();

  function focusField(field: Field) {
    const inputRefs = {
      nickname: nicknameRef,
      email: emailRef,
      password: passwordRef,
      passwordConfirm: passwordConfirmRef,
    };
    inputRefs[field].current?.focus();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as Field;
    const nextValues = { ...values, [field]: event.target.value };

    onChange(nextValues);
    setFormError(undefined);
    if (!submitted) return;

    // 비밀번호를 바꾸면 확인 칸의 일치 여부도 달라지므로 함께 다시 검사합니다.
    const fieldsToCheck: Field[] = field === 'password' ? ['password', 'passwordConfirm'] : [field];
    setErrors((prev) => {
      const next = { ...prev };
      for (const target of fieldsToCheck) next[target] = VALIDATORS[target](nextValues);
      return next;
    });
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors: Errors = {};
    for (const field of FIELDS) nextErrors[field] = VALIDATORS[field](values);
    setSubmitted(true);
    setErrors(nextErrors);

    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setFormError(undefined);
      focusField(firstInvalid);
      return;
    }

    submittingRef.current = true;
    setPending(true);
    setFormError(undefined);

    try {
      await sendEmailCode({ email: values.email.trim() });
      // 2단계로 넘어가면 이 폼은 화면에서 사라지므로 pending 등을 되돌릴 필요가 없습니다.
      onCodeSent();
      return;
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors((prev) => ({ ...prev, email: DUPLICATE_EMAIL_MESSAGE }));
        focusField('email');
      } else {
        setFormError(getAuthErrorMessage(error));
      }
    }

    submittingRef.current = false;
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-[19px]">
        <Input
          ref={nicknameRef}
          id={nicknameId}
          name="nickname"
          type="text"
          autoComplete="nickname"
          // 2단계에서 "이메일 수정하기"로 돌아왔을 때 키보드·스크린 리더 사용자가 화면 전환을 알 수 있게 합니다.
          autoFocus={autoFocusFirstField}
          label="닉네임"
          placeholder="사용할 닉네임을 입력해 주세요"
          value={values.nickname}
          onChange={handleChange}
          error={errors.nickname}
        />
        <Input
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
        <Input
          ref={passwordRef}
          id={passwordId}
          name="password"
          type="password"
          autoComplete="new-password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          helper={`${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`}
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          ref={passwordConfirmRef}
          id={passwordConfirmId}
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해 주세요"
          value={values.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="mt-6 w-full">
        {pending ? '보내는 중...' : '회원가입'}
      </Button>

      <AuthFormError message={formError} />
    </form>
  );
}
