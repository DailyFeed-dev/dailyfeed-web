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
    <div className="flex flex-col gap-5 rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) p-7 shadow-[0_12px_32px_rgba(97,87,233,0.08)]">
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
  );
}

// ④ 게시판에서 함께 나누면 더 빨리 성장해요 (흰 배경)
export default function WhyBoardSection() {
  return (
    <section className="flex flex-col gap-14 py-24 lg:py-30">
      <Reveal>
        <SectionHeading
          path="~/dailyfeed/board"
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
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-brand-soft) font-mono text-[15px] font-bold text-(--color-text-brand)">
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
