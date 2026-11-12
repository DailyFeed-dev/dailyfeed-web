import AuthCard from '@/components/auth/AuthCard';
import AuthTextLink from '@/components/auth/AuthTextLink';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

// 새 비밀번호 설정 화면 (Figma 06). 메일로 받은 보안키로 비밀번호를 바꿉니다.
export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="DAILYFEED"
      title="새 비밀번호 설정"
      description="메일로 받은 보안키와 새 비밀번호를 입력해 주세요."
      footerDivider={false}
      footer={
        <p className="text-center">
          <AuthTextLink href="/login">로그인으로 돌아가기</AuthTextLink>
        </p>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
