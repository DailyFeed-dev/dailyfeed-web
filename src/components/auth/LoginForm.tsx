'use client';

import Link from 'next/link';
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
import { validateEmail, validateRequired } from '@/components/auth/validation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { tokenStorage, type Schemas } from '@/lib/api';
import { login } from '@/services/authService';

type Field = 'email' | 'password';
type Errors = Partial<Record<Field, string>>;

// 화면에 놓인 순서입니다. 에러가 나면 이 순서대로 첫 번째 오류 칸에 포커스를 옮깁니다.
const FIELDS: Field[] = ['email', 'password'];

const VALIDATORS: Record<Field, (value: string) => string | undefined> = {
  email: validateEmail,
  // 로그인에서는 비밀번호 길이 규칙을 검사하지 않습니다. (회원가입에서 검사)
  password: (value) => validateRequired(value, '비밀번호를 입력해 주세요.'),
};

type AccountStatus = NonNullable<Schemas['AuthResponse']['accountStatus']>;

// 로그인 API 는 성공했지만 아직 서비스를 쓸 수 없는 계정 상태와 안내 문구입니다.
// 'ACTIVE' 만 로그인을 허용하고, 여기에 없는 값은 UNKNOWN_ACCOUNT_STATUS_MESSAGE 를 보여줍니다.
const BLOCKED_ACCOUNT_MESSAGES: Partial<Record<AccountStatus, string>> = {
  PENDING_APPROVAL: '가입 승인 대기 중인 계정이에요. 승인 후 로그인할 수 있어요.',
  REJECTED: '가입이 승인되지 않은 계정이에요.',
};
const UNKNOWN_ACCOUNT_STATUS_MESSAGE = '로그인할 수 없는 계정 상태예요. 관리자에게 문의해 주세요.';

/**
 * 로그인 입력 폼입니다. 입력값·에러 상태를 다루므로 클라이언트 컴포넌트입니다.
 * 처음 제출할 때 전체를 검사하고, 그 뒤로는 값이 바뀔 때마다 해당 칸만 다시 검사합니다.
 */
export default function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  // 버튼이 disabled 로 다시 그려지기 전에 연달아 제출되는 것까지 막기 위한 표시입니다.
  const submittingRef = useRef(false);
  // 로그인에 성공해 화면을 떠날 때만 폼을 비우기 위한 표시입니다. (아래 useLayoutEffect 참고)
  const shouldResetRef = useRef(false);

  const [values, setValues] = useState<Record<Field, string>>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  // 서버 응답이나 계정 상태 때문에 로그인하지 못했을 때 폼 아래에 보여줄 문구입니다.
  const [formError, setFormError] = useState<string>();

  // cacheComponents 가 켜져 있으면 Next.js 는 떠난 페이지를 지우지 않고 <Activity> 로 숨겨 둡니다.
  // 그대로 두면 다시 /login 에 왔을 때 "로그인 중..." 버튼과 입력했던 비밀번호가 남아 있으므로,
  // 로그인 성공 후 화면이 숨겨질 때 폼을 처음 상태로 되돌립니다. (docs: preserving-ui-state)
  useLayoutEffect(() => {
    return () => {
      if (!shouldResetRef.current) return;
      shouldResetRef.current = false;
      submittingRef.current = false;
      setValues({ email: '', password: '' });
      setErrors({});
      setSubmitted(false);
      setPending(false);
      setFormError(undefined);
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as Field;
    const { value } = event.target;

    setValues((prev) => ({ ...prev, [field]: value }));
    setFormError(undefined);
    if (submitted) setErrors((prev) => ({ ...prev, [field]: VALIDATORS[field](value) }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors: Errors = {};
    for (const field of FIELDS) nextErrors[field] = VALIDATORS[field](values[field]);
    setSubmitted(true);
    setErrors(nextErrors);

    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setFormError(undefined);
      const inputRef = firstInvalid === 'email' ? emailRef : passwordRef;
      inputRef.current?.focus();
      return;
    }

    submittingRef.current = true;
    setPending(true);
    setFormError(undefined);

    try {
      const auth = await login({ email: values.email.trim(), password: values.password });

      if (auth.accountStatus === 'ACTIVE') {
        // 뒤로 가기로 로그인 화면에 돌아오지 않도록 push 대신 replace 로 이동합니다.
        // 이동이 끝날 때까지 버튼은 "로그인 중..." 상태로 둡니다.
        shouldResetRef.current = true;
        router.replace('/');
        return;
      }

      // 승인 대기·거절·알 수 없는 상태의 계정은 로그인 상태로 두지 않습니다.
      tokenStorage.clear();
      setFormError(
        (auth.accountStatus && BLOCKED_ACCOUNT_MESSAGES[auth.accountStatus]) ||
          UNKNOWN_ACCOUNT_STATUS_MESSAGE,
      );
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }

    submittingRef.current = false;
    setPending(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-[25px]">
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

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending}
        className="mt-[30px] w-full"
      >
        {pending ? '로그인 중...' : '로그인'}
      </Button>

      <AuthFormError message={formError} />
    </form>
  );
}
