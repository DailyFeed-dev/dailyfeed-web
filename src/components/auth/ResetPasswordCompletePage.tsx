import Link from 'next/link';

import AuthCard from '@/components/auth/AuthCard';
import { buttonClassName } from '@/components/common/Button';

// 비밀번호 변경 완료 화면 (Figma 07).
export default function ResetPasswordCompletePage() {
  return (
    <AuthCard
      eyebrow="DAILYFEED"
      title="비밀번호가 변경됐어요"
      description="새 비밀번호로 다시 로그인해 주세요."
    >
      <p className="mt-8 text-base leading-[23px] text-(--color-text-secondary)">
        비밀번호 변경이 완료되었습니다.
        <br />
        로그인 화면에서 계속 이용할 수 있어요.
      </p>

      {/* 페이지 이동이라 버튼이 아닌 링크입니다. 모양만 공통 Button 과 같게 맞춥니다. */}
      <Link
        href="/login"
        className={buttonClassName({
          variant: 'primary',
          size: 'lg',
          className: 'mt-[110px] w-full',
        })}
      >
        로그인하러 가기
      </Link>
    </AuthCard>
  );
}
