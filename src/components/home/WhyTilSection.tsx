import { fullBleedBackground, PAGE_BG } from './fullBleed';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

// TIL 예시 카드에 보여 줄 3줄 템플릿
const TEMPLATE = [
  { heading: '오늘 배운 것', body: 'useEffect 의존성 배열이 비어 있으면 처음 한 번만 실행돼요.' },
  { heading: '왜 중요했나', body: 'API 를 매번 다시 불러와서 화면이 깜빡이는 문제를 고쳤어요.' },
  { heading: '다음에 해 볼 것', body: '- 데이터 불러오기를 커스텀 훅으로 분리해 보기' },
];

const BENEFITS = [
  {
    no: '01',
    title: '배운 걸 오래 기억해요',
    desc: '직접 정리하면 이해가 깊어지고, 나중에 다시 꺼내 보기 쉬워요.',
  },
  {
    no: '02',
    title: '나만의 개발 사전이 생겨요',
    desc: '같은 에러를 두 번 검색하지 않도록 해결 방법이 쌓여요.',
  },
  { no: '03', title: '성장이 눈에 보여요', desc: '쌓인 기록과 연속 기록이 꾸준히 할 힘이 돼요.' },
  {
    no: '04',
    title: '포트폴리오가 돼요',
    desc: '꾸준한 기록은 면접에서 성장 과정을 보여 주는 증거가 돼요.',
  },
];

/** 왼쪽: "이렇게 쓰면 돼요"를 보여 주는 어두운 TIL 예시 카드 */
function TilTemplateCard() {
  return (
    // 입체감: 뒤에 연보라 종이 한 장(오른쪽 아래로 12px) + 위가 살짝 밝은 그라데이션 + 위쪽 하이라이트 + 깊은 그림자
    <div className="relative isolate mr-3 mb-3">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-2xl bg-[#C3BEFF]/60"
      />
      <div className="flex flex-col gap-3.5 rounded-2xl bg-linear-to-b from-[#2A2838] to-[#1F1D2B] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_10px_rgba(31,29,43,0.18),0_20px_40px_rgba(31,29,43,0.28)]">
        <span className="self-start rounded-full bg-[#2E2D3A] px-2.5 py-1 font-mono text-[12px] leading-[1.5] text-(--color-text-disabled)">
          til/2026-11-11.md
        </span>
        {TEMPLATE.map((item) => (
          <div key={item.heading} className="flex flex-col gap-1.5">
            <p className="text-[15px] font-bold text-(--color-text-on-brand)">
              <span className="font-mono">## </span>
              {item.heading}
            </p>
            <p className="text-[14px] leading-[1.55] text-[#DFDDE8]">{item.body}</p>
          </div>
        ))}
        <p className="font-mono text-[12px] leading-[1.5] text-[#B3AAF7]">
          {'// 3줄이면 충분해요 · 하루 5분 TIL'}
        </p>
      </div>
    </div>
  );
}

// ③ TIL 작성은 왜 필요할까요? (연보라 배경, 화면 끝까지)
export default function WhyTilSection() {
  return (
    <section
      id="why-til"
      className="flex scroll-mt-28 flex-col gap-14 py-24 lg:py-30"
      style={fullBleedBackground(`linear-gradient(${PAGE_BG} 0 0)`)}
    >
      <Reveal>
        <SectionHeading
          title="TIL 작성은 왜 필요할까요?"
          description="TIL(Today I Learned)은 오늘 배운 것을 짧게 남기는 개발 기록이에요. 한 줄이어도 괜찮아요."
        />
      </Reveal>

      {/* 1200px(75rem) 이상: 왼쪽 예시 카드 520px + 오른쪽 2×2 / 그보다 좁으면 위아래로 쌓임 */}
      <div className="grid gap-6 min-[75rem]:grid-cols-[520px_minmax(0,1fr)]">
        <Reveal>
          <TilTemplateCard />
        </Reveal>
        {/* 카드 4장은 한 묶음으로 같이 떠오르게 (예시 카드보다 살짝 늦게) */}
        <Reveal delay={120}>
          <ul className="grid gap-6 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              // 입체감: 흰색 → 아주 연한 보라 그라데이션 + 위쪽 하이라이트 + 가까운 그림자 · 은은한 보라 그림자
              <li
                key={b.no}
                className="flex h-full flex-col gap-3 rounded-2xl border border-(--color-border-default) bg-linear-to-b from-(--color-bg-surface) to-[#FAF9FF] p-7 shadow-[inset_0_1px_0_#FFFFFF,0_1px_2px_rgba(31,29,43,0.06),0_10px_24px_rgba(97,87,233,0.12)]"
              >
                <span className="self-start rounded-md bg-(--color-bg-brand-soft) px-2 py-0.5 font-mono text-[13px] leading-[1.55] font-semibold text-(--color-text-brand)">
                  {b.no}
                </span>
                <h3 className="text-[20px] leading-[1.35] font-bold text-(--color-text-primary)">
                  {b.title}
                </h3>
                <p className="text-[14px] leading-[1.55] text-(--color-text-secondary)">{b.desc}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
