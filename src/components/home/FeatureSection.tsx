import type { ComponentType, ReactNode, SVGProps } from 'react';

import { MessageCircleIcon } from '@/components/common/icons';

import { BookOpenIcon, CircleHelpIcon, LockIcon, MessageSquareTextIcon } from './icons';
import { buttonHover } from './buttonHover';
import LoginRequiredLink from './LoginRequiredLink';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import SectionJumpLink from './SectionJumpLink';

type Variant = 'brand' | 'light' | 'dark';

/**
 * 마우스를 올리면: 4px 들어 올려지고, 테두리에 얇은 빛나는 선 + 같은 색의 은은한 빛 + 아래 그림자
 * (클릭하는 카드는 아니라서 커서는 그대로예요. "동작 줄이기" 사용자에게는 움직이지 않고 빛만 나요)
 */
const CARD_HOVER =
  'transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0';

const CARD_STYLE: Record<
  Variant,
  { card: string; glow: string; path: string; title: string; desc: string; icon: string }
> = {
  brand: {
    card: 'bg-(--color-bg-brand)',
    // 연보라(brand/300) 선 + 보라 빛
    glow: 'hover:shadow-[0_0_0_2px_#B3AAF7,0_0_28px_rgba(138,127,243,0.55),0_18px_40px_rgba(97,87,233,0.25)]',
    path: 'bg-(--color-bg-surface)/15 text-(--color-text-on-brand)',
    title: 'text-(--color-text-on-brand)',
    desc: 'text-(--color-text-on-brand)/90',
    icon: 'text-(--color-text-on-brand)',
  },
  light: {
    card: 'border border-(--color-border-default) bg-(--color-bg-surface)',
    // 보라(brand/500) 선 + 연한 보라 빛 (테두리 색도 같이 바꿔 선이 겹쳐 보이지 않게)
    glow: 'hover:border-(--color-border-brand) hover:shadow-[0_0_0_1px_#6157E9,0_0_24px_rgba(97,87,233,0.28),0_18px_40px_rgba(31,29,43,0.08)]',
    path: 'bg-(--color-bg-brand-soft) text-(--color-text-brand)',
    title: 'text-(--color-text-primary)',
    desc: 'text-(--color-text-secondary)',
    icon: 'text-[#6157E9]',
  },
  dark: {
    card: 'bg-[#1F1D2B]',
    // 자물쇠 아이콘과 같은 노랑(yellow/400) 선 + 노란 빛
    glow: 'hover:shadow-[0_0_0_2px_rgba(232,209,86,0.75),0_0_28px_rgba(232,209,86,0.35),0_18px_40px_rgba(31,29,43,0.35)]',
    path: 'bg-[#2E2D3A] text-(--color-text-disabled)',
    title: 'text-(--color-text-on-brand)',
    desc: 'text-(--color-text-disabled)',
    icon: 'text-[#E8D156]',
  },
};

/** 큰 기능 카드: 오른쪽 위 모서리가 크게 둥근 카드 (radius/xl 16 · 오른쪽 위 120) */
function FeatureCard({
  variant,
  path,
  icon: CardIcon,
  title,
  description,
  preview,
  delay = 0,
}: {
  variant: Variant;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: ReactNode;
  preview: ReactNode;
  /** 스크롤로 나타날 때 기다릴 시간(ms). 카드 3장을 순서대로 띄워요 */
  delay?: number;
}) {
  const s = CARD_STYLE[variant];
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`flex h-full flex-col justify-between gap-8 rounded-2xl rounded-tr-[120px] p-9 min-[75rem]:min-h-125 ${s.card} ${CARD_HOVER} ${s.glow}`}
      >
        <div className="flex flex-col items-start gap-4">
          <span
            className={`rounded-full px-2.5 py-1 font-mono text-[12px] leading-[1.5] ${s.path}`}
          >
            {path}
          </span>
          <CardIcon className={`size-6 ${s.icon}`} />
          <h3 className={`text-[30px] leading-[1.3] font-bold ${s.title}`}>{title}</h3>
          <p className={`text-[16px] leading-[1.5] font-normal ${s.desc}`}>{description}</p>
        </div>
        {preview}
      </article>
    </Reveal>
  );
}

/**
 * 아래쪽 바로가기 카드 (채팅 · FAQ)
 * - href 가 '#'으로 시작하면 같은 페이지 안 섹션으로 부드럽게 이동해요. (FAQ → #faq, 로그인 필요 없음)
 * - 그 외 주소는 로그인이 필요한 곳이라, 로그인 전이면 로그인 화면으로 보내요. (채팅 → LoginRequiredLink)
 */
function FeatureLinkCard({
  href,
  icon: CardIcon,
  title,
  description,
  delay = 0,
}: {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  delay?: number;
}) {
  // 마우스를 올리면 연보라로 한 단계 진해지고 살짝 떠오름 (버튼과 같은 느낌)
  const className = `group flex items-center gap-5 rounded-2xl border border-(--color-border-default) bg-[#F6F5FB] py-7 pr-8 pl-7 ${buttonHover.card}`;
  const content = (
    <>
      {/* 카드가 연보라가 되면 아이콘 칸은 흰색으로 바뀌어 또렷하게 보여요 */}
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-brand-soft) text-[#6157E9] transition-colors duration-200 group-hover:bg-(--color-bg-surface)">
        <CardIcon className="size-6" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[20px] leading-[1.35] font-bold text-(--color-text-primary)">
          {title}
        </span>
        <span className="text-[14px] leading-[1.55] text-(--color-text-secondary)">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-[18px] leading-[1.4] font-semibold text-(--color-text-brand) transition-transform group-hover:translate-x-1"
      >
        -&gt;
      </span>
    </>
  );

  return (
    <Reveal delay={delay}>
      {href.startsWith('#') ? (
        <SectionJumpLink targetId={href.slice(1)} className={className}>
          {content}
        </SectionJumpLink>
      ) : (
        <LoginRequiredLink href={href} className={className}>
          {content}
        </LoginRequiredLink>
      )}
    </Reveal>
  );
}

// ② 기능 소개: 큰 카드 3개 (TIL · 자유게시판 · 비밀게시판) + 바로가기 2개 (채팅 · FAQ)
// 카드 안 미리보기는 소개용 예시 문구입니다. (API 필요 없음)
export default function FeatureSection() {
  return (
    <section id="features" className="flex scroll-mt-28 flex-col gap-14 py-24 lg:py-30">
      <Reveal>
        <SectionHeading
          title="DailyFeed에서 할 수 있는 일"
          description="기록하고, 나누고, 솔직하게 이야기해요. 필요한 공간이 모두 한곳에 있어요."
        />
      </Reveal>

      {/* 카드 3열은 히어로와 같이 화면 1200px(75rem) 이상부터. 그보다 좁으면 한 줄씩 쌓이고, 카드 높이는 내용만큼 */}
      <div className="grid gap-6 min-[75rem]:grid-cols-3">
        <FeatureCard
          variant="brand"
          path="~/til"
          icon={BookOpenIcon}
          title="TIL · 학습 기록"
          description={
            <>
              오늘 배운 것을 짧게 남겨요.
              <br />
              마크다운과 코드 블록으로
              <br />
              깔끔하게 정리할 수 있어요.
            </>
          }
          preview={
            <pre className="rounded-xl bg-[#4B3FD6] px-4.5 py-4 font-mono text-[13px] leading-[1.55] whitespace-pre-wrap text-(--color-text-on-brand)">
              <span className="text-[#E8D156]">&gt;</span> til write --tag react{'\n'}
              {'  '}# useEffect 의존성 배열 정리{'\n'}
              {'  '}saved · streak +1 (22일째)
            </pre>
          }
        />
        <FeatureCard
          variant="light"
          delay={120}
          path="~/board/free"
          icon={MessageSquareTextIcon}
          title="자유게시판"
          description={
            <>
              질문, 자료, 프로젝트 이야기까지
              <br />
              자유롭게 묻고 답해요.
              <br />
              좋은 글은 팀의 자료가 돼요.
            </>
          }
          preview={
            <ul className="flex flex-col gap-2">
              {[
                ['Next.js 배포 에러 질문이요', 12],
                ['React 스터디원 모집해요', 5],
              ].map(([title, count]) => (
                <li
                  key={title}
                  className="flex items-center justify-between rounded-lg border border-(--color-border-default) bg-(--color-bg-subtle) px-3.5 py-2.5"
                >
                  <span className="text-[14px] leading-[1.5] font-medium text-(--color-text-primary)">
                    {title}
                  </span>
                  <span className="text-[12px] leading-[1.5] text-(--color-text-muted)">
                    댓글 {count}
                  </span>
                </li>
              ))}
            </ul>
          }
        />
        {/* ⚠️ 익명 작성 기능이 백엔드에 아직 없습니다. 지원 여부에 따라 문구를 고칩니다. */}
        <FeatureCard
          variant="dark"
          delay={240}
          path="~/board/secret"
          icon={LockIcon}
          title="비밀게시판"
          description={
            <>
              이름 없이 고민과 솔직한
              <br />
              이야기를 나눠요.
              <br />
              작성자는 공개되지 않아요.
            </>
          }
          preview={
            <div className="flex flex-col gap-2.5 rounded-xl bg-[#2E2D3A] px-4.5 py-4">
              <p className="flex items-center gap-2">
                {/* 04 · Avatar Size=XS 자리 (익명이라 ? 표시) */}
                <span className="flex size-6 items-center justify-center rounded-full bg-[#6C6980] text-[11px] leading-[1.45] font-medium text-(--color-text-on-brand)">
                  ?
                </span>
                <span className="text-[14px] leading-[1.5] font-medium text-(--color-text-on-brand)">
                  익명의 개발자
                </span>
                <span className="text-[12px] leading-[1.5] text-(--color-text-disabled)">
                  · 3분 전
                </span>
              </p>
              <p className="text-[14px] leading-[1.55] text-[#DFDDE8]">
                취업 준비하다 번아웃 온 분 계신가요?
              </p>
              <p className="font-mono text-[12px] leading-[1.5] text-(--color-text-muted)">
                author: &quot;********&quot;
              </p>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 채팅은 로그인이 필요해요(로그인 전이면 로그인 화면으로) · FAQ 는 아래 FAQ 섹션으로 이동 */}
        <FeatureLinkCard
          href="/chat"
          icon={MessageCircleIcon}
          title="채팅"
          description="프로젝트 팀원과 실시간으로 대화하고 1:1로 질문해요."
        />
        <FeatureLinkCard
          href="#faq"
          delay={120}
          icon={CircleHelpIcon}
          title="FAQ"
          description="처음이라면 자주 묻는 질문부터 확인해 보세요."
        />
      </div>
    </section>
  );
}
