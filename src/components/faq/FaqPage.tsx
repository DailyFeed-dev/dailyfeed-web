import FaqTabs from './FaqTabs';

/**
 * FAQ 화면 (/faq) — 헤더 메뉴와 온보딩의 FAQ 카드 · 버튼으로 들어오는 화면
 * 주제 탭을 눌러 질문을 골라 봐요. 질문 목록은 faqItems.ts 에 있어요.
 * 로그인 없이 볼 수 있어요.
 */
export default function FaqPage() {
  return (
    <section className="mx-auto flex w-full max-w-200 flex-col gap-10 py-16 lg:py-24">
      <h1 className="text-center text-[32px] leading-tight font-bold text-(--color-text-primary)">
        자주 묻는 질문
      </h1>
      <FaqTabs />
    </section>
  );
}
