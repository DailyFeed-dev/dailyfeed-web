'use client';

import { useRouter } from 'next/navigation';
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';

import { getAuthErrorMessage } from '@/components/auth/authErrorMessage';
import AuthFormError from '@/components/auth/AuthFormError';
import { resetEmailStorage } from '@/components/auth/resetEmailStorage';
import {
  PASSWORD_MIN_LENGTH,
  validateEmail,
  validateNewPassword,
  validatePasswordConfirm,
  validateRequired,
} from '@/components/auth/validation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { resetPassword } from '@/services/authService';

type Field = 'email' | 'token' | 'newPassword' | 'newPasswordConfirm';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

// 화면에 놓인 순서입니다. 에러가 나면 이 순서대로 첫 번째 오류 칸에 포커스를 옮깁니다.
const FIELDS: Field[] = ['email', 'token', 'newPassword', 'newPasswordConfirm'];

// 비밀번호 확인 칸은 새 비밀번호와 비교해야 해서 입력값 전체를 받습니다.
const VALIDATORS: Record<Field, (values: Values) => string | undefined> = {
  email: (values) => validateEmail(values.email),
  token: (values) => validateRequired(values.token, '보안키를 입력해 주세요.'),
  newPassword: (values) => validateNewPassword(values.newPassword),
  newPasswordConfirm: (values) =>
    validatePasswordConfirm(values.newPasswordConfirm, values.newPassword),
};

// sessionStorage 는 바뀌어도 알려 주지 않으므로 구독할 것이 없습니다.
const subscribeNothing = () => () => {};

/**
 * 새 비밀번호 설정(06) 폼입니다. 동작 방식은 LoginForm 과 같습니다.
 * 이메일 칸은 비밀번호 찾기(04)에서 입력한 이메일로 미리 채우고, 사용자가 고칠 수 있습니다.
 */
export default function ResetPasswordForm() {
  const router = useRouter();
  const emailId = useId();
  const tokenId = useId();
  const newPasswordId = useId();
  const newPasswordConfirmId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfirmRef = useRef<HTMLInputElement>(null);
  // 버튼이 disabled 로 다시 그려지기 전에 연달아 제출되는 것까지 막기 위한 표시입니다.
  const submittingRef = useRef(false);
  // 요청에 성공해 화면을 떠날 때만 폼을 비우기 위한 표시입니다. (LoginForm 과 같은 이유)
  const shouldResetRef = useRef(false);

  // 04 에서 저장한 이메일입니다. 서버 렌더링 때는 '' 로, 브라우저에서는 sessionStorage 값으로 읽어
  // 서버와 첫 화면이 달라서 생기는 하이드레이션 경고 없이 채웁니다.
  const savedEmail = useSyncExternalStore(subscribeNothing, resetEmailStorage.get, () => '');

  // 사용자가 아직 고치지 않은 칸은 undefined 로 두고, 이메일은 그 동안 savedEmail 을 보여줍니다.
  const [edited, setEdited] = useState<Partial<Values>>({});
  const values: Values = {
    email: edited.email ?? savedEmail,
    token: edited.token ?? '',
    newPassword: edited.newPassword ?? '',
    newPasswordConfirm: edited.newPasswordConfirm ?? '',
  };
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();

  // cacheComponents 때문에 떠난 화면이 숨겨진 채 남으므로, 성공 후 숨겨질 때 처음 상태로 되돌립니다.
  useLayoutEffect(() => {
    return () => {
      if (!shouldResetRef.current) return;
      shouldResetRef.current = false;
      submittingRef.current = false;
      setEdited({});
      setErrors({});
      setSubmitted(false);
      setPending(false);
      setFormError(undefined);
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as Field;
    const { value } = event.target;
    const nextValues = { ...values, [field]: value };

    setEdited((prev) => ({ ...prev, [field]: value }));
    setFormError(undefined);
    if (!submitted) return;

    // 새 비밀번호를 바꾸면 확인 칸의 일치 여부도 달라지므로 함께 다시 검사합니다.
    const fieldsToCheck: Field[] =
      field === 'newPassword' ? ['newPassword', 'newPasswordConfirm'] : [field];
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
      const inputRefs = {
        email: emailRef,
        token: tokenRef,
        newPassword: newPasswordRef,
        newPasswordConfirm: newPasswordConfirmRef,
      };
      inputRefs[firstInvalid].current?.focus();
      return;
    }

    submittingRef.current = true;
    setPending(true);
    setFormError(undefined);

    try {
      await resetPassword({
        email: values.email.trim(),
        token: values.token.trim(),
        newPassword: values.newPassword,
      });
      resetEmailStorage.clear();
      shouldResetRef.current = true;
      // 이미 사용한 보안키로 이 화면에 돌아오지 않도록 push 대신 replace 로 이동합니다.
      router.replace('/reset-password/complete');
      return;
    } catch (submitError) {
      setFormError(getAuthErrorMessage(submitError));
    }

    submittingRef.current = false;
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-[9px]">
        <Input
          ref={emailRef}
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          label="이메일"
          placeholder="가입한 이메일을 입력해 주세요"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          ref={tokenRef}
          id={tokenId}
          name="token"
          type="text"
          autoComplete="one-time-code"
          label="보안키"
          placeholder="메일로 받은 보안키를 입력해 주세요"
          value={values.token}
          onChange={handleChange}
          error={errors.token}
        />
        <Input
          ref={newPasswordRef}
          id={newPasswordId}
          name="newPassword"
          type="password"
          autoComplete="new-password"
          label="새 비밀번호"
          placeholder="새 비밀번호를 입력해 주세요"
          helper={`${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`}
          value={values.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
        />
        <Input
          ref={newPasswordConfirmRef}
          id={newPasswordConfirmId}
          name="newPasswordConfirm"
          type="password"
          autoComplete="new-password"
          label="새 비밀번호 확인"
          placeholder="새 비밀번호를 다시 입력해 주세요"
          value={values.newPasswordConfirm}
          onChange={handleChange}
          error={errors.newPasswordConfirm}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="mt-6 w-full">
        {pending ? '변경 중...' : '비밀번호 변경'}
      </Button>

      <AuthFormError message={formError} />
    </form>
  );
}
