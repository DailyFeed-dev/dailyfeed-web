type PagePlaceholderProps = {
  title: string;
  issue?: number;
};

/**
 * 아직 개발되지 않은 페이지에 임시로 보여주는 화면입니다.
 * 담당자는 자기 기능 화면을 만들면서 이 컴포넌트 사용을 지우면 됩니다.
 */
export default function PagePlaceholder({ title, issue }: PagePlaceholderProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-zinc-500">
        작업 예정 페이지입니다.{issue ? ` (이슈 #${issue})` : ''}
      </p>
    </section>
  );
}
