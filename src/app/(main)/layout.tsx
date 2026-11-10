import Header from '@/components/common/Header';

// 헤더가 있는 화면들의 공통 레이아웃입니다. (주소에는 (main) 이 나타나지 않습니다)
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4">{children}</main>
    </>
  );
}
