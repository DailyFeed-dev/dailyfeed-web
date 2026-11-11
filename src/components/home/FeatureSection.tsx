import Link from 'next/link';
import type { ComponentType, ReactNode, SVGProps } from 'react';

import {
  BookOpenIcon,
  CircleHelpIcon,
  LockIcon,
  MessageCircleIcon,
  MessageSquareTextIcon,
} from './icons';

type Variant = 'brand' | 'light' | 'dark';

const CARD_STYLE: Record<
  Variant,
  { card: string; path: string; title: string; desc: string; icon: string }
> = {
  brand: {
    card: 'bg-[#6157E9]',
    path: 'bg-[#FFFFFF]/15 text-[#FFFFFF]',
    title: 'text-[#FFFFFF]',
    desc: 'text-[#FFFFFF]/90',
    icon: 'text-[#FFFFFF]',
  },
  light: {
    card: 'border border-[#ECEAF4] bg-[#FFFFFF]',
    path: 'bg-[#F0EEFE] text-[#4B3FD6]',
    title: 'text-[#1F1D2B]',
    desc: 'text-[#5F5C75]',
    icon: 'text-[#6157E9]',
  },
  dark: {
    card: 'bg-[#1F1D2B]',
    path: 'bg-[#2E2D3A] text-[#A9A8B6]',
    title: 'text-[#FFFFFF]',
    desc: 'text-[#A9A8B6]',
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
}: {
  variant: Variant;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: ReactNode;
  preview: ReactNode;
}) {
  const s = CARD_STYLE[variant];
  return (
    <article
      className={`flex min-h-125 flex-col justify-between gap-8 rounded-2xl rounded-tr-[120px] p-9 ${s.card}`}
    >
      <div className="flex flex-col items-start gap-4">
        <span className={`rounded-full px-2.5 py-1 font-mono text-[12px] leading-[1.5] ${s.path}`}>
          {path}
        </span>
        <CardIcon className={`size-6 ${s.icon}`} />
        <h3 className={`text-[30px] leading-[1.3] font-bold ${s.title}`}>{title}</h3>
        <p className={`text-[16px] leading-[1.5] font-normal ${s.desc}`}>{description}</p>
      </div>
      {preview}
    </article>
  );
}

/** 아래쪽 바로가기 카드 (채팅 · FAQ) */
function FeatureLinkCard({
  href,
  icon: CardIcon,
  title,
  description,
}: {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 rounded-2xl border border-[#ECEAF4] bg-[#F6F5FB] py-7 pr-8 pl-7 transition-colors hover:border-[#6157E9]"
    >
      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#F0EEFE] text-[#6157E9]">
        <CardIcon className="size-6" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[20px] leading-[1.35] font-bold text-[#1F1D2B]">{title}</span>
        <span className="text-[14px] leading-[1.55] text-[#5F5C75]">{description}</span>
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-[18px] leading-[1.4] font-semibold text-[#4B3FD6] transition-transform group-hover:translate-x-1"
      >
        -&gt;
      </span>
    </Link>
  );
}

// ② 기능 소개: 큰 카드 3개 (TIL · 자유게시판 · 비밀게시판) + 바로가기 2개 (채팅 · FAQ)
// 카드 안 미리보기는 소개용 예시 문구입니다. (API 필요 없음)
export default function FeatureSection() {
  return (
    <section id="features" className="flex scroll-mt-28 flex-col gap-14 py-24 lg:py-30">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[14px] leading-[1.5] font-medium text-[#4B3FD6]">
          ~/dailyfeed/features
        </p>
        {/* ⚠️ 40px 섹션 제목은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 요청 필요) */}
        <h2 className="text-[32px] leading-tight font-bold text-[#1F1D2B] sm:text-[40px]">
          DailyFeed에서 할 수 있는 일
        </h2>
        <p className="text-[16px] leading-[1.5] font-normal text-[#5F5C75]">
          기록하고, 나누고, 솔직하게 이야기해요. 필요한 공간이 모두 한곳에 있어요.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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
            <pre className="rounded-xl bg-[#4B3FD6] px-4.5 py-4 font-mono text-[13px] leading-[1.55] whitespace-pre-wrap text-[#FFFFFF]">
              <span className="text-[#E8D156]">&gt;</span> til write --tag react{'\n'}
              {'  '}# useEffect 의존성 배열 정리{'\n'}
              {'  '}saved · streak +1 (22일째)
            </pre>
          }
        />
        <FeatureCard
          variant="light"
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
                  className="flex items-center justify-between rounded-lg border border-[#ECEAF4] bg-[#F3F2F8] px-3.5 py-2.5"
                >
                  <span className="text-[14px] leading-[1.5] font-medium text-[#1F1D2B]">
                    {title}
                  </span>
                  <span className="text-[12px] leading-[1.5] text-[#6C6980]">댓글 {count}</span>
                </li>
              ))}
            </ul>
          }
        />
        {/* ⚠️ 익명 작성 기능이 백엔드에 아직 없습니다. 지원 여부에 따라 문구를 고칩니다. */}
        <FeatureCard
          variant="dark"
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
                <span className="flex size-6 items-center justify-center rounded-full bg-[#6C6980] text-[11px] leading-[1.45] font-medium text-[#FFFFFF]">
                  ?
                </span>
                <span className="text-[14px] leading-[1.5] font-medium text-[#FFFFFF]">
                  익명의 개발자
                </span>
                <span className="text-[12px] leading-[1.5] text-[#A9A8B6]">· 3분 전</span>
              </p>
              <p className="text-[14px] leading-[1.55] text-[#DFDDE8]">
                취업 준비하다 번아웃 온 분 계신가요?
              </p>
              <p className="font-mono text-[12px] leading-[1.5] text-[#6C6980]">
                author: &quot;********&quot;
              </p>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FeatureLinkCard
          href="/chat"
          icon={MessageCircleIcon}
          title="채팅"
          description="프로젝트 팀원과 실시간으로 대화하고 1:1로 질문해요."
        />
        <FeatureLinkCard
          href="/faq"
          icon={CircleHelpIcon}
          title="FAQ"
          description="처음이라면 자주 묻는 질문부터 확인해 보세요."
        />
      </div>
    </section>
  );
}
