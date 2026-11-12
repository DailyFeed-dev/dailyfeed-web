import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import TerminalWindow from './TerminalWindow';

const STEPS = [
  {
    no: '01',
    command: 'dailyfeed join',
    title: '회원가입',
    description: ['이메일로 가입하고', '관심 있는 기술 태그를 골라요.'],
  },
  {
    no: '02',
    command: 'dailyfeed write --til',
    title: '첫 TIL 남기기',
    description: ['오늘 배운 것을 한 줄이라도', '기록하면 스트릭이 시작돼요.'],
  },
  {
    no: '03',
    command: 'dailyfeed share',
    title: '함께 나누기',
    description: ['게시판에 올리고 댓글로', '피드백을 주고받아요.'],
  },
];

// ⑥ 3단계로 시작해요: 터미널 창 안에 단계 3개
// 배경: 흰색 (바로 앞 채팅 섹션이 연보라라서 번갈아 보이도록)
export default function StepsSection() {
  return (
    <section className="flex flex-col gap-10 py-24 lg:py-30">
      <Reveal>
        <SectionHeading title="3단계로 시작해요" />
      </Reveal>

      <Reveal>
        <TerminalWindow title="zsh — ~/dailyfeed">
          <ol className="grid divide-y divide-[#2E2D3A] px-4 pt-10 pb-11 md:grid-cols-3 md:divide-x md:divide-y-0">
            {STEPS.map((step, i) => (
              <li key={step.no} className="px-6 py-6 md:py-0">
                {/* 터미널 창이 뜬 뒤 단계 01 → 02 → 03 순서로 떠오르게 */}
                <Reveal delay={250 + 150 * i} className="flex flex-col gap-3">
                  <span className="font-mono text-[13px] leading-[1.55] text-[#B3AAF7]">
                    {step.no}
                  </span>
                  <p className="font-mono text-[16px] leading-[1.5] font-bold">
                    <span className="text-(--color-text-muted)">$</span>{' '}
                    <span className="text-(--color-text-success)">{step.command}</span>
                  </p>
                  <h3 className="text-[20px] leading-[1.35] font-bold text-(--color-text-on-brand)">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-[1.55] text-(--color-text-disabled)">
                    {step.description[0]}
                    <br />
                    {step.description[1]}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
