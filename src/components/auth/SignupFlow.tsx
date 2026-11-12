'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import AuthCard from '@/components/auth/AuthCard';
import AuthNextLink from '@/components/auth/AuthNextLink';
import { authTextLinkClassName } from '@/components/auth/AuthTextLink';
import SignupDetailsForm, { type SignupDetails } from '@/components/auth/SignupDetailsForm';
import SignupVerifyForm from '@/components/auth/SignupVerifyForm';

type Step = 'details' | 'verify';

const EMPTY_DETAILS: SignupDetails = { nickname: '', email: '', password: '', passwordConfirm: '' };

/**
 * 회원가입 2단계 흐름입니다. 주소(/signup)는 그대로 두고 카드 내용만 바꿉니다.
 * - 1단계(Figma 02): 닉네임·이메일·비밀번호 입력 → 인증번호 발송
 * - 2단계(Figma 03): 인증번호 확인 → 가입
 *
 * 단계마다 카드 제목이 바뀌어서 AuthCard 까지 이 클라이언트 컴포넌트가 그립니다.
 * 1단계 입력값은 "이메일 수정하기"로 돌아왔을 때 남아 있어야 하므로 두 폼이 아닌 여기에 둡니다.
 * 인증번호·인증 성공 여부는 2단계 폼 안에만 있어서, 1단계로 돌아가 폼이 사라지면 함께 초기화됩니다.
 */
export default function SignupFlow() {
  const [step, setStep] = useState<Step>('details');
  const [details, setDetails] = useState<SignupDetails>(EMPTY_DETAILS);
  // 단계를 바꾼 적이 있을 때만 새 단계의 첫 입력칸으로 포커스를 옮깁니다. (처음 들어왔을 때는 옮기지 않음)
  const [stepChanged, setStepChanged] = useState(false);
  // 가입 요청까지 끝나 화면을 떠날 때만 처음 상태로 되돌리기 위한 표시입니다.
  const shouldResetRef = useRef(false);

  // cacheComponents 때문에 떠난 화면이 숨겨진 채 남습니다. 가입 도중에 떠났다면 진행 상황을 그대로 두고,
  // 가입이 끝난 뒤 떠날 때만 1단계 빈 폼으로 되돌립니다. (docs: preserving-ui-state)
  useLayoutEffect(() => {
    return () => {
      if (!shouldResetRef.current) return;
      shouldResetRef.current = false;
      setStep('details');
      setDetails(EMPTY_DETAILS);
      setStepChanged(false);
    };
  }, []);

  function goToStep(next: Step) {
    setStep(next);
    setStepChanged(true);
  }

  if (step === 'verify') {
    return (
      <AuthCard
        eyebrow="DAILYFEED"
        title="이메일을 확인해 주세요"
        description="가입을 마치려면 이메일 인증이 필요해요."
      >
        <SignupVerifyForm
          details={details}
          onEditEmail={() => goToStep('details')}
          onFinish={() => {
            shouldResetRef.current = true;
          }}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="DAILYFEED"
      title="계정 만들기"
      description="함께 배우고 나눌 준비가 되셨나요?"
      footerDivider={false}
      footer={
        <p className="text-center text-sm font-medium text-(--color-text-brand)">
          이미 계정이 있나요?{' '}
          <AuthNextLink href="/login" className={authTextLinkClassName}>
            로그인
          </AuthNextLink>
        </p>
      }
    >
      <SignupDetailsForm
        values={details}
        onChange={setDetails}
        autoFocusFirstField={stepChanged}
        onCodeSent={() => goToStep('verify')}
      />
    </AuthCard>
  );
}
