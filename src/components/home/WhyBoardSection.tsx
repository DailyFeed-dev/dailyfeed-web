import Badge from '@/components/common/Badge';

import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const BENEFITS = [
  {
    no: '01',
    title: '먼저 겪은 동료가 있어요',
    desc: '질문하면 경험에서 나온 답을 빠르게 받을 수 있어요.',
  },
  {
    no: '02',
    title: '더 나은 방법을 배워요',
    desc: '댓글 피드백으로 코드 리뷰를 받는 효과가 있어요.',
  },
  {
    no: '03',
    title: '자료가 팀의 지식이 돼요',
    desc: '흩어진 링크와 문서가 한곳에 모여 다시 찾기 쉬워요.',
  },
  {
    no: '04',
    title: '설명하며 더 깊이 이해해요',
    desc: '남에게 알려 주다 보면 내 이해도 단단해져요.',
  },
];

// 오른쪽 게시글 미리보기의 예시 댓글 (소개용 고정 문구 · API 필요 없음)
const COMMENTS = [
  {
    initial: '이',
    name: '이상민',
    message: 'next.config 의 images 설정에 이미지 주소(도메인)를 추가해 보세요!',
  },
  {
    initial: '엄',
    name: '엄재윤',
    message: '저도 같은 문제를 겪었어요. 정리해 둔 TIL 링크 남길게요 → til/2026-11-02',
  },
];

/** 오른쪽: 질문 → 동료 댓글 → 해결됨 흐름을 보여 주는 게시글 미리보기 */
function ThreadPreview() {
  return (
    // 입체감: 뒤에 살짝 기울어진 게시글 카드 2장이 쌓여 있는 모습 ("글 더미" 느낌)
    // 1200px 미만에서는 미리보기가 화면 폭을 꽉 채워서, 기울어진 카드가 화면 밖으로 나가지 않게 숨겨요
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 hidden translate-x-5 translate-y-4 rotate-3 rounded-2xl border border-(--color-border-default) bg-(--color-bg-brand-soft) min-[75rem]:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden translate-x-2 translate-y-2 rotate-[1.5deg] rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-[0_8px_20px_rgba(31,29,43,0.06)] min-[75rem]:block"
      />
      <div className="flex flex-col gap-5 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-7 shadow-[inset_0_1px_0_#FFFFFF,0_2px_6px_rgba(31,29,43,0.06),0_18px_40px_rgba(97,87,233,0.14)]">
        <div className="flex items-center gap-2">
          <Badge tone="neutral">게시판</Badge>
          <Badge tone="success">해결됨</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-[20px] leading-[1.35] font-bold text-(--color-text-primary)">
            Next.js 배포 후 이미지가 안 보여요
          </h3>
          <p className="text-[13px] leading-[1.55] text-(--color-text-muted)">
            최동하 · 10분 전 · 댓글 2
          </p>
        </div>
        <hr className="border-(--color-border-default)" />
        <ul className="flex flex-col gap-5">
          {COMMENTS.map((c) => (
            <li key={c.name} className="flex gap-3">
              {/* 04 · Avatar Size=S 모양 (공통 Avatar 컴포넌트는 아직 없음) */}
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--color-bg-brand-muted) text-[12px] font-semibold text-(--color-text-brand)"
              >
                {c.initial}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl bg-[#F6F5FB] px-4 py-3">
                <p className="text-[13px] leading-[1.5] font-medium text-(--color-text-primary)">
                  {c.name}
                </p>
                <p className="text-[14px] leading-[1.55] text-(--color-text-secondary)">
                  {c.message}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-[13px] leading-[1.55] text-(--color-text-muted)">
          ♡ 12 · 이 글이 팀 자료실에 저장됐어요
        </p>
      </div>
    </div>
  );
}

// ④ 게시판에서 함께 나누면 더 빨리 성장해요 (흰 배경 + 오른쪽 장식)
export default function WhyBoardSection() {
  return (
    <section
      className="relative isolate flex flex-col gap-14 py-24 lg:py-30"
      // 빛 번짐이 좌우로는 화면 끝까지 퍼지고, 위아래는 섹션 안에서 잘리게 (가로 스크롤 없음)
      style={{ clipPath: 'inset(0 -100vmax)' }}
    >
      {/* 배경 장식: 오른쪽에 점 무늬(가장자리로 흐려짐) + 보라 · 노랑 빛 번짐 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-y-0 right-0 w-3/5"
          style={{
            backgroundImage: 'radial-gradient(#C3BEFF 1.6px, transparent 1.6px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 70% 60%, black 20%, transparent 75%)',
          }}
        />
        <div className="absolute top-1/3 right-[8%] size-110 rounded-full bg-[#B3AAF7] opacity-35 blur-[120px]" />
        <div className="absolute right-[30%] bottom-10 size-64 rounded-full bg-[#E8D156] opacity-25 blur-[110px]" />
      </div>
      <Reveal>
        <SectionHeading
          title="게시판에서 함께 나누면 더 빨리 성장해요"
          description="혼자 막히던 문제도, 먼저 겪은 동료의 한마디로 풀릴 때가 많아요."
        />
      </Reveal>

      {/* 1200px(75rem) 이상: 왼쪽 이점 목록 + 오른쪽 게시글 미리보기 600px / 그보다 좁으면 위아래로 쌓임 */}
      <div className="grid items-center gap-16 min-[75rem]:grid-cols-[minmax(0,1fr)_600px]">
        {/* 이점 4개는 한 묶음으로 같이 떠오르게 */}
        <Reveal>
          <ol className="flex flex-col gap-7">
            {BENEFITS.map((b) => (
              <li key={b.no} className="flex gap-5">
                {/* 번호 칸: 연보라 그라데이션 + 위쪽 하이라이트 + 작은 그림자로 살짝 볼록하게 */}
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-b from-(--color-bg-brand-soft) to-(--color-bg-brand-muted) font-mono text-[15px] font-bold text-(--color-text-brand) shadow-[inset_0_1px_0_#FFFFFF,0_4px_10px_rgba(97,87,233,0.18)]">
                  {b.no}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[20px] leading-[1.35] font-bold text-(--color-text-primary)">
                    {b.title}
                  </h3>
                  <p className="text-[14px] leading-[1.55] text-(--color-text-secondary)">
                    {b.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={200}>
          <ThreadPreview />
        </Reveal>
      </div>
    </section>
  );
}
