import AuthCard from '@/components/auth/AuthCard';
import AuthNextLink from '@/components/auth/AuthNextLink';
import LoginForm from '@/components/auth/LoginForm';
import RedirectIfLoggedIn from '@/components/auth/RedirectIfLoggedIn';

// 로그인 화면 (이슈 #4). 바깥 틀(헤더, 소개 패널)은 app/(auth)/layout.tsx 의 AuthShell 이 그립니다.
export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="WELCOME BACK"
      title="다시 만나서 반가워요"
      description="로그인하고 함께 배움을 이어가요."
      footer={
        <p className="flex flex-wrap items-center justify-center gap-x-2 text-sm">
          <span className="text-[#888698]">아직 계정이 없으신가요?</span>
          {/* ?next= 가 있으면 회원가입 화면에도 이어서 넘깁니다. */}
          <AuthNextLink
            href="/signup"
            className="font-bold text-(--color-text-brand) hover:underline"
          >
            회원가입
          </AuthNextLink>
        </p>
      }
    >
      <RedirectIfLoggedIn />
      <LoginForm />
    </AuthCard>
  );
}
