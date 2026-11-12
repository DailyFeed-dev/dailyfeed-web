import Badge from '@/components/common/Badge';

import { fullBleedBackground, PAGE_BG } from './fullBleed';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

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

/**
 * 왼쪽: 실제 TIL 상세 화면을 작게 옮긴 예시 (에브리타임 소개 화면처럼)
 * - 뒤: 브라우저 창 틀 안에 TIL 본문(마크다운) · 좋아요 · 댓글 수
 * - 앞: 글 머리(날짜 · 제목 · 작성자) 카드가 창 밖으로 살짝 튀어나와 떠 있어요
 * 구성은 til/TilDetailPage 와 같아요. 작성자 자리에는 실제로 닉네임(가입 때 입력)이 보여요.
 * 내용은 소개용 예시예요. (API 필요 없음)
 */
function TilScreenMock() {
  return (
    <div className="relative h-full pl-6 sm:pl-10">
      {/* 뒤: 브라우저 창 */}
      <div className="h-full overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-[0_12px_32px_rgba(97,87,233,0.10)]">
        <div className="flex h-10 items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-bg-subtle) px-4">
          <span className="size-2.5 rounded-full bg-[#DFDDE8]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#DFDDE8]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#DFDDE8]" aria-hidden="true" />
          <span className="ml-3 truncate rounded-md bg-(--color-bg-surface) px-3 py-0.5 font-mono text-[11px] leading-[1.5] text-(--color-text-muted)">
            dailyfeed / til / 42
          </span>
        </div>

        {/* 앞 카드(글 머리)가 덮는 자리만큼 위를 비워 둬요 */}
        <div className="flex flex-col gap-3 px-6 pt-42 pb-5 text-[13px] leading-[1.6] text-(--color-text-secondary)">
          <p className="text-[15px] font-bold text-(--color-text-primary)">오늘 배운 것</p>
          <p>
            의존성 배열이 <b className="font-semibold text-(--color-text-primary)">비어 있으면</b>{' '}
            처음 한 번만, 값을 넣으면 그 값이 바뀔 때마다 다시 실행돼요.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-(--color-border-default) bg-(--color-bg-subtle) px-4 py-3 font-mono text-[12px] leading-[1.6] text-(--color-text-primary)">
            <span className="text-(--color-text-brand)">useEffect</span>
            {'(() => {\n  '}
            <span className="text-[#8A7FF3]">fetchPosts</span>
            {'();\n}, []);'}
          </pre>
          <p className="text-[15px] font-bold text-(--color-text-primary)">다음에 해 볼 것</p>
          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded bg-(--color-bg-brand) text-[10px] text-(--color-text-on-brand)">
                ✓
              </span>
              공식 문서 다시 읽기
            </li>
            <li className="flex items-center gap-2">
              <span className="size-4 rounded border border-(--color-border-default)" />
              데이터 불러오기를 커스텀 훅으로 분리하기
            </li>
          </ul>
          <hr className="mt-1 border-(--color-border-default)" />
          <div className="flex items-center gap-4 text-[12px] font-medium text-(--color-text-muted)">
            <span className="text-(--color-text-brand)">♥ 좋아요 24</span>
            <span>댓글 5</span>
          </div>
        </div>
      </div>

      {/* 앞: 창 밖으로 튀어나온 글 머리 카드 */}
      <div className="absolute top-12 right-6 left-0 flex flex-col gap-3 rounded-2xl border border-(--color-border-brand-soft) bg-(--color-bg-surface) px-6 py-5 shadow-[0_2px_6px_rgba(31,29,43,0.05),0_16px_36px_rgba(97,87,233,0.16)] sm:right-10">
        <Badge tone="brand" className="self-start">
          2026.11.12
        </Badge>
        <p className="text-[20px] leading-[1.3] font-bold text-(--color-text-primary)">
          useEffect 의존성 배열 정리
        </p>
        <span className="flex items-center gap-2 text-[13px] font-medium text-(--color-text-primary)">
          <span className="flex size-6 items-center justify-center rounded-full bg-(--color-bg-brand-muted) text-[11px] text-(--color-text-brand)">
            코
          </span>
          코딩하는민지
          <span className="font-normal text-(--color-text-muted)">· 5분 전</span>
        </span>
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

      {/* 1200px(75rem) 이상: 왼쪽 TIL 화면 예시 480px + 오른쪽 2×2 / 그보다 좁으면 위아래로 쌓임
          왼쪽 예시와 오른쪽 카드 4장을 한 묶음으로 같이 띄우고, 오른쪽 카드 4장 묶음의 가운데를 왼쪽 예시의 가운데에 맞춰요 (가로 간격은 넓게, 세로 간격은 좁게) */}
      <Reveal className="grid gap-6 min-[75rem]:grid-cols-[480px_minmax(0,1fr)] min-[75rem]:gap-x-16">
        <TilScreenMock />
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 min-[75rem]:self-center">
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
    </section>
  );
}
