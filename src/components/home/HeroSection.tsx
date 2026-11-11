import Link from 'next/link';

import Badge from '@/components/common/Badge';
import { buttonClassName } from '@/components/common/Button';

import { fullBleedBackground, PAGE_BG } from './fullBleed';
import { BookOpenIcon, MessageSquareTextIcon } from './icons';
import { buttonHover } from './buttonHover';
import CountUp from './CountUp';
import Reveal from './Reveal';
import SectionJumpLink from './SectionJumpLink';
import TerminalWindow from './TerminalWindow';

// TODO: 숫자는 예시입니다. 로그인 없이 볼 수 있는 공개 통계 API 가 없어서 (백엔드 요청 중) 안 되면 이 영역을 뺍니다.
// 숫자는 화면에 보일 때 0부터 올라가서 이 값에 멈춰요 (CountUp). API 가 생기면 이 값만 실제 숫자로 바꾸면 돼요.
const STATS = [
  { value: 1284, label: '누적 TIL', icon: BookOpenIcon },
  { value: 3920, label: '게시글', icon: MessageSquareTextIcon },
];

// 연속 기록 카드의 7일 칸 (brand/50 → brand/600)
const WEEK = [
  'bg-(--color-bg-brand-soft)',
  'bg-(--color-bg-brand-muted)',
  'bg-[#C3BEFF]',
  'bg-[#B3AAF7]',
  'bg-[#8A7FF3]',
  'bg-(--color-bg-brand)',
  'bg-[#4B3FD6]',
];

/** 코드 한 줄을 색깔별 조각으로 나눈 것. 색은 Figma 코드 창과 같은 팀 색 변수예요. */
const CODE: { text: string; className?: string }[][] = [
  [{ text: '## 오늘의 TIL · 2026.11.10', className: 'font-bold text-(--color-text-on-brand)' }],
  [],
  [
    { text: 'const', className: 'text-[#B3AAF7]' },
    { text: ' today = ' },
    { text: 'learn', className: 'text-(--color-text-success)' },
    { text: '(' },
    { text: '"App Router"', className: 'text-[#E8D156]' },
    { text: ');' },
  ],
  [{ text: '// (main) 그룹은 주소에 안 보여요', className: 'text-(--color-text-muted)' }],
  [],
  [
    { text: 'export default function', className: 'text-[#B3AAF7]' },
    { text: ' ' },
    { text: 'Feed', className: 'text-(--color-text-success)' },
    { text: '() {' },
  ],
  [
    { text: '  ' },
    { text: 'return', className: 'text-[#B3AAF7]' },
    { text: ' ' },
    { text: '<PostList', className: 'text-[#8A7FF3]' },
    { text: ' tag=' },
    { text: '"TIL"', className: 'text-[#E8D156]' },
    { text: ' ' },
    { text: '/>', className: 'text-[#8A7FF3]' },
    { text: ';' },
  ],
  [{ text: '}' }],
  [],
  [
    { text: '$ git commit -m', className: 'text-(--color-text-success)' },
    { text: ' ' },
    { text: '"feat: 오늘의 기록"', className: 'text-[#E8D156]' },
  ],
];

function CodeEditorMock() {
  return (
    <TerminalWindow title="til/2026-11-10.md" className="shadow-2xl shadow-[#6157E9]/20">
      {/* 코드 글자: Code 스타일(13 · 160%) + gray/300 */}
      <pre className="overflow-x-auto px-6 py-6 font-mono text-[13px] leading-[1.6] text-[#DFDDE8]">
        {CODE.map((line, i) => (
          <div key={i} className="flex gap-6">
            <span className="w-5 shrink-0 text-right text-(--color-text-muted) select-none">
              {i + 1}
            </span>
            <code>
              {line.length === 0
                ? ' '
                : line.map((part, j) => (
                    <span key={j} className={part.className}>
                      {part.text}
                    </span>
                  ))}
            </code>
          </div>
        ))}
        <div className="flex gap-6">
          <span className="w-5 shrink-0" />
          <span className="mt-1 h-5 w-2.5 animate-pulse bg-[#8A7FF3]" aria-hidden="true" />
        </div>
      </pre>
    </TerminalWindow>
  );
}

/** 04 · Tag (Soft · Outline): 여백 6/12 · Label/S · radius/full. TODO(common): 공통 Tag 로 교체 */
function FloatingTags() {
  const tag =
    'rounded-full px-3 py-1.5 text-[13px] leading-[1.5] font-medium text-(--color-text-brand)';
  return (
    <div className="flex gap-2 rounded-full border border-(--color-border-default) bg-(--color-bg-surface) p-3 shadow-lg shadow-[#6157E9]/10">
      <span className={`${tag} bg-(--color-bg-brand-soft)`}>#Next.js</span>
      <span className={`${tag} bg-(--color-bg-brand-soft)`}>#TIL</span>
      <span className={`${tag} border border-(--color-border-brand-soft) bg-(--color-bg-surface)`}>
        #React
      </span>
    </div>
  );
}

function StreakCard() {
  return (
    <div className="flex w-66 flex-col gap-3 rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) p-5 shadow-lg shadow-[#6157E9]/10">
      <div className="flex items-center justify-between">
        <span className="text-[13px] leading-[1.5] font-medium text-(--color-text-secondary)">
          연속 기록
        </span>
        <Badge tone="success">21일째</Badge>
      </div>
      <p className="text-[18px] leading-[1.4] font-semibold text-(--color-text-primary)">
        오늘도 한 줄 남겼어요
      </p>
      <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
        {WEEK.map((color, i) => (
          <span key={i} className={`h-7 rounded-md ${color}`} />
        ))}
      </div>
      <p className="text-[12px] leading-[1.5] text-(--color-text-muted)">지난 7일 · 매일 커밋 중</p>
    </div>
  );
}

// ① 히어로: 소개 문구 + 버튼 + 숫자 / 오른쪽 코드 창
export default function HeroSection() {
  return (
    <section
      className="relative isolate -mx-4 px-4 pt-20 pb-24 sm:-mx-10 sm:px-10 lg:-mx-20 lg:px-20 lg:pt-28 lg:pb-32"
      style={{
        // 연보라 바탕을 끝까지 유지 + 맨 아래 1px 구분선(border/default)을 화면 양끝까지 칠함
        // (아래로 흰색이 되면 다음 흰색 섹션과 경계가 흐려져서, 바탕은 그대로 두고 선으로 나눠요)
        ...fullBleedBackground(
          `linear-gradient(to bottom, ${PAGE_BG} calc(100% - 1px), var(--color-border-default) calc(100% - 1px))`,
        ),
        // 빛 번짐이 좌우로는 화면 끝까지 퍼지고, 위아래는 섹션 안에서 잘리게 함 (가로 스크롤 없음)
        clipPath: 'inset(0 -100vmax)',
      }}
    >
      {/* 배경: 48px 개발자 그리드 + 보라 · 노랑 빛 */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-bg-brand-muted) 1px, transparent 1px), linear-gradient(to bottom, var(--color-bg-brand-muted) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            // 왼쪽 · 오른쪽 끝 · 아래로 부드럽게 사라지게 (넓은 화면에서 격자가 뚝 끊겨 보이지 않도록)
            maskImage:
              'linear-gradient(to left, transparent 0%, black 12%, black 30%, transparent 75%), linear-gradient(to top, transparent 0%, black 40%)',
            maskComposite: 'intersect',
          }}
        />
        <div className="absolute -top-40 right-0 size-160 rounded-full bg-[#B3AAF7] opacity-50 blur-[180px]" />
        <div className="absolute right-40 -bottom-20 size-90 rounded-full bg-[#E8D156] opacity-40 blur-[160px]" />
      </div>

      {/* 화면 폭에 따른 배치
          - 1200px 미만: 글 → 코드 창 순서로 한 줄씩 쌓임
          - 1200 ~ 1439px: 2열, 글과 코드 창을 반반 (코드 창을 624px로 고정하면 글 칸이 좁아져 제목이 끊겨요)
          - 1440px 이상: 2열, 시안대로 코드 창 624px */}
      <div className="grid grid-cols-1 items-center gap-16 min-[75rem]:grid-cols-2 min-[90rem]:grid-cols-[minmax(0,1fr)_minmax(0,624px)]">
        {/* 왼쪽: 소개 (처음 열렸을 때 떠오르며 등장) */}
        <Reveal className="flex min-w-0 flex-col items-start gap-8">
          <span className="flex items-center gap-2 rounded-full border border-(--color-border-brand-soft) bg-(--color-bg-surface) py-2 pr-4 pl-3.5 font-mono text-[13px] leading-[1.55] text-(--color-text-brand)">
            <span className="size-2 rounded-full bg-(--color-text-success)" aria-hidden="true" />
            dailyfeed --onboarding
          </span>

          {/* ⚠️ 56 · 64px 큰 제목은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 요청 필요) */}
          <h1 className="text-(--color-text-primary)">
            <span className="block text-[40px] leading-tight font-light sm:text-[56px]">
              매일 한 줄씩,
            </span>
            <span className="flex items-center gap-6 text-[44px] leading-tight font-black sm:text-[64px]">
              <span>
                함께 쌓는 <span className="text-[#6157E9]">기록</span>
              </span>
              {/* 제목 옆 가로선: 공간이 넉넉할 때만 (640~1199px 한 줄 배치 또는 1440px 이상) */}
              <span
                aria-hidden="true"
                className="hidden h-1 w-30 bg-[#1F1D2B] sm:max-[75rem]:block min-[90rem]:block"
              />
            </span>
          </h1>

          <p className="text-[16px] leading-[1.5] font-normal text-(--color-text-secondary)">
            {/* 줄바꿈(br)은 넓은 화면에서만. 휴대폰에서는 화면 폭에 맞춰 자연스럽게 줄바꿈돼요. */}
            DailyFeed는 오늘 배운 것을 TIL로 남기고, <br className="hidden sm:block" />
            게시판에서 자료와 고민을 나누는 개발자 커뮤니티예요. <br className="hidden sm:block" />
            작은 기록이 쌓여 나와 팀의 자산이 돼요.
          </p>

          <div className="flex gap-3">
            {/* TODO: 회원가입 페이지 주소를 로그인 담당(#4)과 확인. 지금은 /login 으로 보냄 */}
            {/* 마우스를 올리면 한 단계 진한 색 + 살짝 떠오름 (누를 수 있다는 느낌) */}
            <Link
              href="/login"
              className={buttonClassName({
                variant: 'primary',
                size: 'lg',
                className: buttonHover.primary,
              })}
            >
              시작하기
            </Link>
            {/* 같은 페이지 안 기능 소개(#features)로 부드럽게 내려가요. 누를 때마다 동작해요 */}
            <SectionJumpLink
              targetId="features"
              className={buttonClassName({
                variant: 'outline',
                size: 'lg',
                className: buttonHover.outline,
              })}
            >
              둘러보기
            </SectionJumpLink>
          </div>

          {/* 숫자 2개를 작은 카드로: 아이콘 + 큰 숫자(끝에 보라 +) + 이름 */}
          <dl className="flex flex-wrap gap-4">
            {STATS.map(({ value, label, icon: StatIcon }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) py-4 pr-6 pl-4 shadow-[inset_0_1px_0_#FFFFFF,0_8px_24px_rgba(97,87,233,0.10)]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-brand-soft) text-[#6157E9]">
                  <StatIcon className="size-5.5" />
                </span>
                <div className="flex flex-col-reverse">
                  <dt className="text-[13px] leading-[1.5] font-medium text-(--color-text-muted)">
                    {label}
                  </dt>
                  <dd className="text-[32px] leading-[1.15] font-bold tracking-tight text-(--color-text-primary)">
                    {/* 카드가 떠오르는 동안 기다렸다가 숫자가 올라가기 시작해요 */}
                    <CountUp value={value} delay={300} />
                    <span className="text-[#6157E9]">+</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 오른쪽: 코드 창 + 떠 있는 카드 2개 (왼쪽보다 조금 늦게, 떠 있는 카드는 더 늦게 등장) */}
        <Reveal delay={150} className="relative min-w-0 min-[75rem]:pt-8 min-[75rem]:pb-12">
          <div className="min-[75rem]:mr-10 min-[90rem]:mr-16">
            <CodeEditorMock />
          </div>
          {/* 떠 있는 카드 2개는 2열일 때만 보여요 */}
          <div className="absolute -top-4 right-0 hidden min-[75rem]:block">
            <Reveal delay={450}>
              <FloatingTags />
            </Reveal>
          </div>
          <div className="absolute right-0 bottom-0 hidden min-[75rem]:block">
            <Reveal delay={600}>
              <StreakCard />
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
