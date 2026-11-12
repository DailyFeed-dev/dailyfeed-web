import AuthCard from '@/components/auth/AuthCard';
import AuthTextLink from '@/components/auth/AuthTextLink';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

// 비밀번호 찾기 화면 (Figma 04). 이메일로 재설정 보안키를 요청합니다.
export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="DAILYFEED"
      title="비밀번호를 잊으셨나요?"
      description="가입한 이메일로 재설정 보안키를 보내드려요."
      footerDivider={false}
      footer={
        <p className="text-center">
          <AuthTextLink href="/login">로그인으로 돌아가기</AuthTextLink>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
