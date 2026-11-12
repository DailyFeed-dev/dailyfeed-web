import FaqList from './FaqList';

/**
 * FAQ 화면 (/faq) — 헤더의 FAQ 메뉴로 들어오는 화면
 * 질문 목록은 온보딩 하단 FAQ 섹션과 같은 것을 씁니다. (faqItems.ts)
 * 로그인 없이 볼 수 있어요.
 */
export default function FaqPage() {
  return (
    <section className="mx-auto flex w-full max-w-200 flex-col gap-10 py-16 lg:py-24">
      <div className="flex flex-col gap-3">
        <h1 className="text-[32px] leading-tight font-bold text-(--color-text-primary)">
          자주 묻는 질문
        </h1>
        <p className="text-[16px] leading-[1.5] text-(--color-text-secondary)">
          처음 오셨다면 여기부터 확인해 보세요.
        </p>
      </div>
      <FaqList />
    </section>
  );
}
