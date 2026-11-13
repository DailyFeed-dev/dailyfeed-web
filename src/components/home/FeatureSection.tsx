import Link from 'next/link';
import type { ComponentType, ReactNode, SVGProps } from 'react';

import Badge from '@/components/common/Badge';
import { MessageCircleIcon } from '@/components/common/icons';

import { BookOpenIcon, CircleHelpIcon, MessageSquareTextIcon } from './icons';
import { buttonHover } from './buttonHover';
import LoginRequiredLink from './LoginRequiredLink';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

type Variant = 'brand' | 'dark';

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
  dark: {
    // 남색(gray/700) 카드 — 보라 TIL 카드 옆에서 또렷하게 보이도록
    card: 'bg-[#454257]',
    // 카드보다 밝은 남색(gray/500) 선 + 같은 색의 은은한 빛 + 아래 그림자
    glow: 'hover:shadow-[0_0_0_2px_#6C6980,0_0_28px_rgba(108,105,128,0.55),0_18px_40px_rgba(69,66,87,0.38)]',
    path: 'bg-(--color-bg-surface)/10 text-[#B3AAF7]',
    title: 'text-(--color-text-on-brand)',
    desc: 'text-[#DFDDE8]',
    icon: 'text-[#B3AAF7]',
  },
};

// 게시판 카드 미리보기: 실제 게시판의 카테고리 탭(전체 · 자유글 · 질문 · 정보 · 후기)과 예시 글
const BOARD_TABS = ['전체', '자유글', '질문', '정보', '후기'];
const BOARD_POSTS = [
  { category: '질문', title: 'Next.js 배포 에러 질문이요', likes: 12 },
  { category: '정보', title: 'Git 브랜치 전략 정리했어요', likes: 8 },
  { category: '후기', title: '첫 팀 프로젝트 회고', likes: 5 },
];

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
  /** 스크롤로 나타날 때 기다릴 시간(ms). 카드를 순서대로 띄워요 */
  delay?: number;
}) {
  const s = CARD_STYLE[variant];
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`flex h-full flex-col justify-between gap-8 rounded-2xl rounded-tr-[120px] p-9 lg:min-h-110 ${s.card} ${CARD_HOVER} ${s.glow}`}
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
 * - 채팅: 로그인이 필요한 곳이라, 로그인 전이면 로그인 화면으로 보내요. (LoginRequiredLink)
 * - FAQ: 누구나 볼 수 있는 화면이라 바로 이동해요. (isPublic)
 */
function FeatureLinkCard({
  href,
  isPublic = false,
  icon: CardIcon,
  title,
  description,
  delay = 0,
}: {
  href: string;
  /** true 면 로그인 없이 바로 이동 */
  isPublic?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  delay?: number;
}) {
  const CardLink = isPublic ? Link : LoginRequiredLink;
  return (
    <Reveal delay={delay}>
      {/* 마우스를 올리면 연보라로 한 단계 진해지고 살짝 떠오름 (버튼과 같은 느낌) */}
      <CardLink
        href={href}
        className={`group flex items-center gap-5 rounded-2xl border border-(--color-border-default) bg-[#F6F5FB] py-7 pr-8 pl-7 ${buttonHover.card}`}
      >
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
      </CardLink>
    </Reveal>
  );
}

// ② 기능 소개: 큰 카드 2개 (TIL · 게시판) + 바로가기 2개 (채팅 · FAQ)
// 카드 안 미리보기는 소개용 예시 문구입니다. (API 필요 없음)
export default function FeatureSection() {
  return (
    <section className="flex flex-col gap-14 py-24 lg:py-30">
      <Reveal>
        <SectionHeading
          title="DailyFeed에서 할 수 있는 일"
          description="기록하고, 나누고, 솔직하게 이야기해요. 필요한 공간이 모두 한곳에 있어요."
        />
      </Reveal>

      {/* 큰 카드 2열은 아래 바로가기 카드와 같이 1024px(lg) 이상부터. 그보다 좁으면 한 줄씩 쌓여요 */}
      <div className="grid gap-6 lg:grid-cols-2">
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
            // 실제 TIL 목록 카드(til/TilPostCard)와 같은 구성: 날짜 · 제목 · 내용 한 줄 · 작성자(닉네임) · 좋아요 · 댓글
            <div className="flex flex-col gap-3 rounded-xl bg-(--color-bg-surface) px-5 py-4 shadow-[0_8px_24px_rgba(31,29,43,0.18)]">
              <Badge tone="brand" className="self-start">
                2026.11.12
              </Badge>
              <p className="text-[16px] leading-[1.4] font-semibold text-(--color-text-primary)">
                useEffect 의존성 배열 정리
              </p>
              <p className="truncate text-[13px] leading-[1.6] text-(--color-text-secondary)">
                빈 배열이면 처음 한 번만, 값을 넣으면 그 값이 바뀔 때마다 다시 실행돼요.
              </p>
              <hr className="border-(--color-border-default)" />
              <div className="flex items-center justify-between text-[12px] leading-[1.5]">
                <span className="flex items-center gap-2 font-medium text-(--color-text-primary)">
                  <span className="flex size-6 items-center justify-center rounded-full bg-(--color-bg-brand-muted) text-[11px] text-(--color-text-brand)">
                    코
                  </span>
                  코딩하는민지
                </span>
                <span className="text-(--color-text-muted)">좋아요 24 · 댓글 5</span>
              </div>
            </div>
          }
        />
        <FeatureCard
          variant="dark"
          delay={120}
          path="~/board"
          icon={MessageSquareTextIcon}
          title="게시판"
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
            // 실제 게시판(board)과 같은 구성: 위에 카테고리 탭 · 아래 글마다 카테고리 배지
            <div className="flex flex-col gap-1 rounded-xl bg-(--color-bg-surface) px-5 pt-3 pb-2 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
              <div className="flex gap-4 border-b border-(--color-border-default) text-[13px] leading-[1.5]">
                {BOARD_TABS.map((tab, i) => (
                  <span
                    key={tab}
                    className={`-mb-px border-b-2 pb-1.5 ${
                      i === 0
                        ? 'border-(--color-bg-brand) font-semibold text-(--color-text-primary)'
                        : 'border-transparent font-medium text-(--color-text-muted)'
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <ul>
                {BOARD_POSTS.map(({ category, title, likes }) => (
                  <li
                    key={title}
                    className="flex items-center gap-3 border-b border-(--color-border-default) py-2.5 last:border-b-0"
                  >
                    <span className="shrink-0 rounded-full bg-(--color-bg-brand-soft) px-2.5 py-0.5 text-[12px] leading-[1.5] font-medium text-(--color-text-brand)">
                      {category}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[14px] leading-[1.5] font-medium text-(--color-text-primary)">
                      {title}
                    </span>
                    <span className="shrink-0 text-[12px] leading-[1.5] text-(--color-text-muted)">
                      좋아요 {likes}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 채팅은 로그인이 필요해요(로그인 전이면 로그인 화면으로) · FAQ 는 누구나 볼 수 있어요 */}
        <FeatureLinkCard
          href="/chat"
          icon={MessageCircleIcon}
          title="채팅"
          description="프로젝트 팀원과 실시간으로 대화하고 1:1로 질문해요."
        />
        <FeatureLinkCard
          href="/faq"
          isPublic
          delay={120}
          icon={CircleHelpIcon}
          title="FAQ"
          description="처음이라면 자주 묻는 질문부터 확인해 보세요."
        />
      </div>
    </section>
  );
}
