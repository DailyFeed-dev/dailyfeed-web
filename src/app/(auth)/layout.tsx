// 헤더가 없는 화면(로그인 등)의 공통 레이아웃입니다. (주소에는 (auth) 가 나타나지 않습니다)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-1 flex-col items-center justify-center px-4">{children}</main>;
}
