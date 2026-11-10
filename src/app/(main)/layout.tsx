import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

// 사이드바와 헤더가 있는 화면들의 공통 레이아웃입니다. (주소에는 (main) 이 나타나지 않습니다)
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-zinc-100">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4">{children}</main>
      </div>
    </div>
  );
}
