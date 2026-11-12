import FaqList from '@/components/faq/FaqList';

import { fullBleedBackground, PAGE_BG } from './fullBleed';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

// ⑦ 자주 묻는 질문 (연보라 배경, 화면 끝까지) — 아래 시작하기 띠와 배경이 이어져요
// 질문 목록은 components/faq 의 것을 그대로 씁니다. (/faq 화면과 같은 내용)
export default function FaqSection() {
  return (
    <section
      id="faq"
      className="flex scroll-mt-28 flex-col gap-10 py-24 lg:py-30"
      style={fullBleedBackground(`linear-gradient(${PAGE_BG} 0 0)`)}
    >
      <Reveal>
        <SectionHeading
          title="자주 묻는 질문"
          description="처음 오셨다면 여기부터 확인해 보세요."
        />
      </Reveal>
      <Reveal delay={120}>
        <FaqList />
      </Reveal>
    </section>
  );
}
