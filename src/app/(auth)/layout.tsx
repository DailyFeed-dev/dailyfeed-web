import AuthShell from '@/components/auth/AuthShell';

// 로그인·회원가입 등 Auth 화면의 공통 레이아웃입니다. (주소에는 (auth) 가 나타나지 않습니다)
// 메인 헤더 대신 Auth 전용 헤더와 소개 패널을 AuthShell 이 그립니다.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
