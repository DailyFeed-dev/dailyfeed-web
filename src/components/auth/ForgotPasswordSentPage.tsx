import Link from 'next/link';

import AuthCard from '@/components/auth/AuthCard';
import AuthNotice from '@/components/auth/AuthNotice';
import AuthTextLink from '@/components/auth/AuthTextLink';
import { buttonClassName } from '@/components/common/Button';

// 재설정 메일 안내 화면 (Figma 05). 가입 여부를 알려 주지 않도록 항상 같은 문구를 보여줍니다.
export default function ForgotPasswordSentPage() {
  return (
    <AuthCard
      eyebrow="DAILYFEED"
      title="이메일을 확인해 주세요"
      description="메일로 보낸 보안키를 확인해 주세요."
      footerDivider={false}
      footer={
        <p className="text-center">
          <AuthTextLink href="/forgot-password">이메일 다시 입력하기</AuthTextLink>
        </p>
      }
    >
      <p className="mt-8 text-base leading-[23px] text-(--color-text-secondary)">
        입력한 이메일이 가입된 계정과 일치한다면
        <br />
        비밀번호 재설정 보안키를 보내드려요.
      </p>

      <AuthNotice className="mt-[55px]">
        메일이 오지 않았나요? 스팸함도 확인해 주세요.
        <br />
      </AuthNotice>

      {/* 페이지 이동이라 버튼이 아닌 링크입니다. 모양만 공통 Button 과 같게 맞춥니다. */}
      <Link
        href="/reset-password"
        className={buttonClassName({
          variant: 'primary',
          size: 'lg',
          className: 'mt-[63px] w-full',
        })}
      >
        보안키 입력하러 가기
      </Link>
    </AuthCard>
  );
}
