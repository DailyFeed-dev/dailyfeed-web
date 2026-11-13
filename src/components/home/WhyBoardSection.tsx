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

// 오른쪽 게시글 예시의 댓글 · 답글 (소개용 고정 문구 · API 필요 없음)
// 작성자 자리에는 실제로 닉네임(가입 때 입력)이 보여서 예시도 닉네임으로 적었어요.
const COMMENTS = [
  {
    author: '넥스트장인',
    time: '8분 전',
    content: 'next.config 의 images.remotePatterns 에 이미지 주소를 추가해 보세요!',
    likes: 5,
    reply: {
      author: '프론트입문자',
      time: '3분 전',
      content: '추가하니까 바로 나와요. 감사합니다!',
    },
  },
  {
    author: '새벽코더',
    time: '1분 전',
    content: '저도 같은 문제를 겪었어요. 정리해 둔 TIL 링크 남길게요!',
    likes: 2,
  },
];

/** 댓글 한 줄 (실제 게시판 댓글과 같은 구성: 첫 글자 · 닉네임 · 시간 · 내용 · ♡ · 답글 달기) */
function CommentRow({
  author,
  time,
  content,
  likes,
  isReply = false,
}: {
  author: string;
  time: string;
  content: string;
  likes?: number;
  isReply?: boolean;
}) {
  return (
    <div className="flex gap-2.5">
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full bg-(--color-bg-brand-muted) text-[11px] font-semibold text-(--color-text-brand) ${isReply ? 'size-6' : 'size-7'}`}
      >
        {author.slice(0, 1)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[12px] leading-[1.5]">
          <span className="font-semibold text-(--color-text-primary)">{author}</span>
          <span className="text-(--color-text-muted)">{time}</span>
        </p>
        <p className="text-[13px] leading-[1.6] text-(--color-text-secondary)">{content}</p>
        {!isReply && (
          <p className="mt-0.5 flex gap-3 text-[11px] leading-[1.5] text-(--color-text-muted)">
            <span>♡ {likes}</span>
            <span>답글 달기</span>
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * 오른쪽: 실제 게시판 상세 화면을 작게 옮긴 예시 (TIL 섹션과 같은 방식)
 * - 뒤: 브라우저 창 틀 안에 본문 · 태그 · 좋아요 · 댓글과 답글
 * - 앞: 글 머리(카테고리 · 제목 · 작성자 · 시간 · 조회) 카드가 창 밖으로 살짝 튀어나와 떠 있어요
 * 구성은 board/BoardDetailPost · BoardCommentSection 과 같아요.
 */
function BoardScreenMock() {
  return (
    <div className="relative pr-6 sm:pr-10">
      {/* 뒤: 브라우저 창 */}
      <div className="overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-[0_12px_32px_rgba(97,87,233,0.10)]">
        <div className="flex h-10 items-center gap-1.5 border-b border-(--color-border-default) bg-(--color-bg-subtle) px-4">
          <span className="size-2.5 rounded-full bg-[#DFDDE8]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#DFDDE8]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#DFDDE8]" aria-hidden="true" />
          <span className="ml-3 truncate rounded-md bg-(--color-bg-surface) px-3 py-0.5 font-mono text-[11px] leading-[1.5] text-(--color-text-muted)">
            dailyfeed / board / 17
          </span>
        </div>

        {/* 앞 카드(글 머리)가 덮는 자리만큼 위를 비워 둬요 */}
        <div className="flex flex-col gap-3 px-6 pt-40 pb-5">
          <p className="text-[13px] leading-[1.6] text-(--color-text-secondary)">
            next/image 에 외부 이미지 주소를 넣었더니 이미지가 안 나오고 에러가 나요.
          </p>
          <ul className="flex gap-1.5 text-[11px] leading-[1.5] text-(--color-text-muted)">
            <li className="rounded-full bg-(--color-bg-subtle) px-2.5 py-0.5">#Next.js</li>
            <li className="rounded-full bg-(--color-bg-subtle) px-2.5 py-0.5">#배포</li>
          </ul>
          <span className="self-start rounded-full border border-(--color-border-brand-soft) bg-(--color-bg-brand-soft) px-3 py-1 text-[12px] leading-[1.5] font-semibold text-(--color-text-brand)">
            👍 좋아요 12
          </span>
          <hr className="border-(--color-border-default)" />
          <p className="text-[13px] leading-[1.5] font-semibold text-(--color-text-primary)">
            댓글 <span className="text-(--color-text-brand)">3</span>
          </p>
          <div className="flex flex-col gap-3">
            {COMMENTS.map((c) => (
              <div key={c.author} className="flex flex-col gap-2">
                <CommentRow author={c.author} time={c.time} content={c.content} likes={c.likes} />
                {c.reply && (
                  <div className="pl-9">
                    <CommentRow
                      author={c.reply.author}
                      time={c.reply.time}
                      content={c.reply.content}
                      isReply
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 앞: 창 밖으로 튀어나온 글 머리 카드 */}
      <div className="absolute top-12 right-0 left-6 flex flex-col gap-3 rounded-2xl border border-(--color-border-brand-soft) bg-(--color-bg-surface) px-6 py-5 shadow-[0_2px_6px_rgba(31,29,43,0.05),0_16px_36px_rgba(97,87,233,0.16)] sm:left-10">
        <span className="self-start rounded-full bg-(--color-bg-brand-soft) px-2.5 py-0.5 text-[12px] leading-[1.5] font-medium text-(--color-text-brand)">
          질문
        </span>
        <p className="text-[20px] leading-[1.3] font-bold text-(--color-text-primary)">
          Next.js 외부 이미지가 안 보여요
        </p>
        <p className="text-[12px] leading-[1.5] text-(--color-text-muted)">
          <span className="font-semibold text-(--color-text-primary)">프론트입문자</span>
          <span className="mx-2">2026.11.12 14:20</span>· 조회 48
        </p>
      </div>
    </div>
  );
}

// ④ 게시판에서 함께 나누면 더 빨리 성장해요 (흰 배경 + 오른쪽 점 무늬 · 보라 빛 / 왼쪽 위 노랑 빛)
export default function WhyBoardSection() {
  return (
    <section
      className="relative isolate flex flex-col gap-14 py-24 lg:py-30"
      // 빛 번짐이 좌우로는 화면 끝까지 퍼지고, 위아래는 섹션 안에서 잘리게 (가로 스크롤 없음)
      style={{ clipPath: 'inset(0 -100vmax)' }}
    >
      {/* 배경 장식: 오른쪽에 점 무늬(가장자리로 흐려짐) + 보라 빛 번짐 · 왼쪽 위 바깥쪽에 노랑 빛 번짐 (글씨를 가리지 않게) */}
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
        <div className="absolute top-10 -left-32 size-72 rounded-full bg-[#E8D156] opacity-15 blur-[130px]" />
      </div>
      <Reveal>
        <SectionHeading
          title="게시판에서 함께 나누면 더 빨리 성장해요"
          description="혼자 막히던 문제도, 먼저 겪은 동료의 한마디로 풀릴 때가 많아요."
        />
      </Reveal>

      {/* 1200px(75rem) 이상: 왼쪽 이점 목록 + 오른쪽 게시판 화면 예시 600px / 그보다 좁으면 위아래로 쌓임
          넓은 화면에서 목록과 예시 사이가 너무 벌어지지 않게, 목록 왼쪽에 여백(pl-16)을 둬서 목록을 예시 쪽으로 조금 밀어요 */}
      <div className="grid items-center gap-16 min-[75rem]:grid-cols-[minmax(0,1fr)_600px]">
        {/* 이점 4개는 한 묶음으로 같이 떠오르게 */}
        <Reveal>
          <ol className="flex flex-col gap-7 min-[75rem]:pl-16">
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
          <BoardScreenMock />
        </Reveal>
      </div>
    </section>
  );
}
