import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';

import { getBlockedAccountMessage } from '@/components/auth/accountStatus';
import { getAuthErrorMessage, getServerErrorMessage } from '@/components/auth/authErrorMessage';
import AuthFormError from '@/components/auth/AuthFormError';
import AuthNotice from '@/components/auth/AuthNotice';
import { authTextLinkClassName } from '@/components/auth/AuthTextLink';
import type { SignupDetails } from '@/components/auth/SignupDetailsForm';
import { getPostLoginPath } from '@/components/auth/nextPath';
import { EMAIL_CODE_LENGTH, validateEmailCode } from '@/components/auth/validation';
import Button, { buttonClassName } from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ApiError, tokenStorage } from '@/lib/api';
import { register, sendEmailCode, verifyEmailCode } from '@/services/authService';

const WRONG_CODE_MESSAGE = '인증번호가 올바르지 않아요. 다시 확인해 주세요.';
const RESENT_MESSAGE = '인증번호를 다시 보냈어요.';
const PENDING_APPROVAL_MESSAGE = '가입 신청이 완료됐어요. 승인 후 로그인할 수 있어요.';

// "인증번호 다시 보내기"·"이메일 수정하기"는 페이지 이동이 아닌 동작이라 <button> 입니다.
// disabled 대신 aria-disabled 를 써서, 요청 중에도 키보드 포커스가 버튼에서 사라지지 않게 합니다.
const TEXT_BUTTON_CLASS = `${authTextLinkClassName} cursor-pointer aria-disabled:cursor-not-allowed aria-disabled:no-underline aria-disabled:opacity-40`;

type SignupVerifyFormProps = {
  /** 1단계에서 입력한 값입니다. 인증번호 확인과 가입 요청에 씁니다. */
  details: SignupDetails;
  /** "이메일 수정하기": 1단계로 돌아갑니다. */
  onEditEmail: () => void;
  /** 가입 요청이 끝나면 부릅니다. 이 화면을 떠날 때 SignupFlow 가 처음 상태로 되돌립니다. */
  onFinish: () => void;
};

/**
 * 회원가입 2단계(Figma 03) 폼입니다. 인증번호를 확인한 뒤 가입을 요청합니다.
 * SignupFlow('use client') 안에서만 쓰여 클라이언트 컴포넌트로 동작합니다.
 * (함수 props 를 받으므로 이 파일에는 'use client' 를 붙이지 않습니다)
 */
export default function SignupVerifyForm({
  details,
  onEditEmail,
  onFinish,
}: SignupVerifyFormProps) {
  const router = useRouter();
  const codeId = useId();
  const pendingMessageId = useId();
  const codeRef = useRef<HTMLInputElement>(null);
  const loginLinkRef = useRef<HTMLAnchorElement>(null);
  // 버튼이 disabled 로 다시 그려지기 전에 연달아 제출되는 것까지 막기 위한 표시입니다.
  const submittingRef = useRef(false);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();
  // 인증번호는 한 번만 쓸 수 있습니다. 인증에 성공한 뒤 가입만 실패했다면, 다시 시도할 때 인증은 건너뜁니다.
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  // 승인이 필요한 계정으로 가입 신청이 끝난 상태입니다. 폼 대신 안내와 로그인 링크를 보여줍니다.
  const [pendingApproval, setPendingApproval] = useState(false);

  // 입력 폼이 사라지면 포커스를 잃으므로, 안내와 함께 나타난 로그인 링크로 포커스를 옮깁니다.
  useEffect(() => {
    if (pendingApproval) loginLinkRef.current?.focus();
  }, [pendingApproval]);

  const busy = pending || resending;
  const email = details.email.trim();

  function showCodeError(message: string) {
    setError(message);
    codeRef.current?.focus();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setCode(value);
    setFormError(undefined);
    if (submitted) setError(validateEmailCode(value));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current || resending) return;

    if (!verified) {
      const nextError = validateEmailCode(code);
      setSubmitted(true);
      setError(nextError);
      if (nextError) {
        setFormError(undefined);
        codeRef.current?.focus();
        return;
      }
    }

    submittingRef.current = true;
    setPending(true);
    setFormError(undefined);
    setResent(false);

    // 이번 제출에서 인증에 성공했는지까지 반영한 값입니다. (state 는 다음 렌더링에야 바뀌므로 따로 둡니다)
    let codeVerified = verified;
    try {
      if (!codeVerified) {
        codeVerified = await verifyEmailCode({ email, code: code.trim() });
        if (!codeVerified) {
          showCodeError(WRONG_CODE_MESSAGE);
        } else {
          setVerified(true);
        }
      }

      if (codeVerified) {
        const auth = await register({
          email,
          name: details.nickname.trim(),
          password: details.password,
        });
        onFinish();

        const blockedMessage = getBlockedAccountMessage(auth.accountStatus);
        if (!blockedMessage) {
          // ?next= 로 받은 원래 주소(없으면 메인)로, 뒤로 가기로 가입 화면에 돌아오지 않도록 replace 로 이동합니다.
          // 이동이 끝날 때까지 버튼은 "가입하는 중..." 상태로 둡니다.
          router.replace(getPostLoginPath());
          return;
        }

        // 승인 대기·거절·알 수 없는 상태의 계정은 로그인 상태로 두지 않습니다. (로그인과 같은 규칙)
        tokenStorage.clear();
        if (auth.accountStatus === 'PENDING_APPROVAL') setPendingApproval(true);
        else setFormError(blockedMessage);
      }
    } catch (submitError) {
      // 인증 단계의 400(인증번호가 틀림·만료)은 서버 문구를 인증번호 칸 아래에 보여줍니다.
      // 인증에 성공한 뒤 가입 요청에서 난 오류는 폼 아래에 보여주고, 다시 시도하면 가입 요청만 보냅니다.
      const codeMessage =
        !codeVerified && submitError instanceof ApiError && submitError.status === 400
          ? getServerErrorMessage(submitError)
          : undefined;
      if (codeMessage) showCodeError(codeMessage);
      else setFormError(getAuthErrorMessage(submitError));
    }

    submittingRef.current = false;
    setPending(false);
  }

  async function handleResend() {
    if (busy) return;

    setResending(true);
    setResent(false);
    setFormError(undefined);

    try {
      await sendEmailCode({ email });
      // 새 인증번호를 받았으니 입력칸과 인증 상태를 처음으로 되돌립니다.
      setCode('');
      setError(undefined);
      setSubmitted(false);
      setVerified(false);
      setResent(true);
    } catch (resendError) {
      setFormError(getAuthErrorMessage(resendError));
    }

    setResending(false);
  }

  function handleEditEmail() {
    if (busy) return;
    onEditEmail();
  }

  if (pendingApproval) {
    return (
      <div className="mt-8">
        <div role="status" id={pendingMessageId}>
          <AuthNotice>{PENDING_APPROVAL_MESSAGE}</AuthNotice>
        </div>
        {/* 포커스가 링크로 옮겨질 때 안내 문구도 함께 읽히도록 연결합니다. */}
        <Link
          ref={loginLinkRef}
          href="/login"
          aria-describedby={pendingMessageId}
          className={buttonClassName({ variant: 'primary', size: 'lg', className: 'mt-6 w-full' })}
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <p className="mt-8 text-base leading-[23px] text-(--color-text-secondary)">
        입력한 이메일로 인증번호 {EMAIL_CODE_LENGTH}자리를 보냈어요.
        <br />
        메일에서 인증번호를 확인해 입력해 주세요.
      </p>

      <Input
        ref={codeRef}
        id={codeId}
        name="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={EMAIL_CODE_LENGTH}
        // 1단계에서 넘어왔을 때 키보드·스크린 리더 사용자가 화면 전환을 알 수 있게 합니다.
        autoFocus
        label="인증번호"
        placeholder={`인증번호 ${EMAIL_CODE_LENGTH}자리를 입력해 주세요`}
        value={code}
        onChange={handleChange}
        error={error}
        className="mt-4"
      />

      <AuthNotice className="mt-6">메일이 오지 않았나요? 스팸함도 확인해 주세요.</AuthNotice>

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="mt-6 w-full">
        {pending ? '가입하는 중...' : '인증하고 가입하기'}
      </Button>

      <AuthFormError message={formError} />

      <div className="mt-[38px] flex items-center justify-center gap-3">
        <button
          type="button"
          aria-disabled={busy || undefined}
          onClick={handleResend}
          className={TEXT_BUTTON_CLASS}
        >
          {resending ? '보내는 중...' : '인증번호 다시 보내기'}
        </button>
        <span aria-hidden="true" className="text-sm text-(--color-text-brand)">
          ·
        </span>
        <button
          type="button"
          aria-disabled={busy || undefined}
          onClick={handleEditEmail}
          className={TEXT_BUTTON_CLASS}
        >
          이메일 수정하기
        </button>
      </div>

      {/* 다시 보낸 결과를 스크린 리더가 읽을 수 있도록 role="status" 영역은 항상 렌더링합니다. */}
      <div role="status">
        {resent && (
          <p className="mt-3 text-center text-[13px] text-(--color-text-secondary)">
            {RESENT_MESSAGE}
          </p>
        )}
      </div>
    </form>
  );
}
