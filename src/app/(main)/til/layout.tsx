// TIL 화면(/til, /til/...) 공통 배경입니다.
// 전역 스타일은 다크 모드에서 배경이 검정이 되므로, 화면 전체를 덮는 흰 배경(before:fixed)을 깔아 둡니다.
// (프로필 페이지와 같은 방식)
export default function TilLayout({ children }: LayoutProps<'/til'>) {
  return (
    <div className="relative isolate flex flex-1 flex-col text-[#1f1d2b] before:fixed before:inset-0 before:-z-10 before:bg-white">
      {children}
    </div>
  );
}
