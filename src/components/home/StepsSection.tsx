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

// ③ 3단계로 시작해요: 터미널 창 안에 단계 3개
export default function StepsSection() {
  return (
    <section className="-mx-4 flex flex-col gap-10 bg-[#F6F5FB] px-4 py-24 sm:-mx-10 sm:px-10 lg:-mx-20 lg:px-20 lg:py-30">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[14px] leading-[1.5] font-medium text-[#4B3FD6]">
          $ dailyfeed --help
        </p>
        {/* ⚠️ 40px 섹션 제목은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 요청 필요) */}
        <h2 className="text-[32px] leading-tight font-bold text-[#1F1D2B] sm:text-[40px]">
          3단계로 시작해요
        </h2>
      </div>

      <TerminalWindow title="zsh — ~/dailyfeed">
        <ol className="grid divide-y divide-[#2E2D3A] px-4 pt-10 pb-11 md:grid-cols-3 md:divide-x md:divide-y-0">
          {STEPS.map((step) => (
            <li key={step.no} className="flex flex-col gap-3 px-6 py-6 md:py-0">
              <span className="font-mono text-[13px] leading-[1.55] text-[#B3AAF7]">{step.no}</span>
              <p className="font-mono text-[16px] leading-[1.5] font-bold">
                <span className="text-[#6C6980]">$</span>{' '}
                <span className="text-[#22C55E]">{step.command}</span>
              </p>
              <h3 className="text-[20px] leading-[1.35] font-bold text-[#FFFFFF]">{step.title}</h3>
              <p className="text-[14px] leading-[1.55] text-[#A9A8B6]">
                {step.description[0]}
                <br />
                {step.description[1]}
              </p>
            </li>
          ))}
        </ol>
      </TerminalWindow>
    </section>
  );
}
