import { buttonClassName } from '@/components/common/Button';
import Icon from '@/components/common/Icon';

import { buttonHover } from './buttonHover';
import { fullBleedBackground, PAGE_BG } from './fullBleed';
import LoginRequiredLink from './LoginRequiredLink';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const FEATURES = [
  { no: '01', title: '팀 채팅방', desc: '프로젝트 팀원끼리 한 방에 모여 바로바로 이야기해요.' },
  { no: '02', title: '1:1 질문', desc: '멘토나 팀원에게 개인 메시지로 편하게 물어봐요.' },
  { no: '03', title: '새 메시지 알림', desc: '답장이 오면 알림으로 바로 알려 줘서 놓치지 않아요.' },
];

// 채팅창 미리보기의 예시 대화 (소개용 고정 문구 · API 필요 없음)
// 내가 보낸 메시지는 author 없이 오른쪽 말풍선으로 보여요.
type Message = {
  text: string;
  time: string;
  author?: { initial: string; name: string };
};

const MESSAGES: Message[] = [
  {
    author: { initial: '이', name: '이상민' },
    text: '오늘 배포 전에 PR 리뷰 한 번만 봐 주실 분 있나요?',
    time: '오후 2:10',
  },
  { text: '제가 볼게요! 링크 남겨 주세요', time: '오후 2:11' },
  {
    author: { initial: '엄', name: '엄재윤' },
    text: '저도 10분 뒤에 같이 볼게요 👀',
    time: '오후 2:12',
  },
];

/** 왼쪽: 팀 채팅방 미리보기 (머리말 · 대화 · 입력 중 표시 · 입력칸) */
function ChatPreview() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-[0_12px_32px_rgba(97,87,233,0.08)]">
      {/* 방 이름 + 접속 인원 */}
      <div className="flex items-center justify-between border-b border-(--color-border-default) px-6 py-4">
        <p className="text-[16px] leading-[1.5] font-semibold text-(--color-text-primary)">
          # 프론트엔드 팀
        </p>
        <p className="flex items-center gap-1.5 text-[12px] leading-[1.5] text-(--color-text-muted)">
          <span className="size-2 rounded-full bg-(--color-text-success)" aria-hidden="true" />
          3명 접속 중
        </p>
      </div>

      {/* 대화 */}
      <ul className="flex flex-col gap-4 px-6 py-6">
        {MESSAGES.map((m) =>
          !m.author ? (
            <li key={m.text} className="flex flex-col items-end gap-1">
              <p className="max-w-[80%] rounded-2xl rounded-br-md bg-(--color-bg-brand) px-4 py-2.5 text-[14px] leading-[1.55] text-(--color-text-on-brand)">
                {m.text}
              </p>
              <span className="text-[11px] leading-[1.45] text-(--color-text-disabled)">
                {m.time}
              </span>
            </li>
          ) : (
            <li key={m.text} className="flex gap-2.5">
              {/* 04 · Avatar Size=S 모양 (공통 Avatar 컴포넌트는 아직 없음) */}
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--color-bg-brand-muted) text-[12px] font-semibold text-(--color-text-brand)"
              >
                {m.author.initial}
              </span>
              <div className="flex max-w-[80%] flex-col gap-1">
                <span className="text-[12px] leading-[1.5] font-semibold text-(--color-text-secondary)">
                  {m.author.name}
                </span>
                <p className="rounded-2xl rounded-tl-md bg-[#F6F5FB] px-4 py-2.5 text-[14px] leading-[1.55] text-(--color-text-primary)">
                  {m.text}
                </p>
                <span className="text-[11px] leading-[1.45] text-(--color-text-disabled)">
                  {m.time}
                </span>
              </div>
            </li>
          ),
        )}
        {/* 입력 중 표시 */}
        <li className="flex items-center gap-2 text-[12px] leading-[1.5] text-(--color-text-muted)">
          <span className="flex gap-1" aria-hidden="true">
            <span className="size-1.5 animate-bounce rounded-full bg-[#B3AAF7] motion-reduce:animate-none" />
            <span className="size-1.5 animate-bounce rounded-full bg-[#B3AAF7] [animation-delay:150ms] motion-reduce:animate-none" />
            <span className="size-1.5 animate-bounce rounded-full bg-[#B3AAF7] [animation-delay:300ms] motion-reduce:animate-none" />
          </span>
          사빈 님이 입력 중…
        </li>
      </ul>

      {/* 입력칸 (보여 주기용) */}
      <div className="flex items-center gap-3 border-t border-(--color-border-default) px-4 py-3">
        <span className="flex-1 rounded-full bg-(--color-bg-subtle) px-4 py-2.5 text-[14px] leading-[1.55] text-(--color-text-disabled)">
          메시지를 입력하세요
        </span>
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--color-bg-brand) text-(--color-text-on-brand)"
        >
          <Icon name="send" size={18} />
        </span>
      </div>
    </div>
  );
}

// ⑤ 채팅 소개 (연보라 배경, 화면 끝까지) — 게시판 섹션과 좌우를 반대로 배치
export default function ChatSection() {
  return (
    <section
      className="flex flex-col gap-14 py-24 lg:py-30"
      style={fullBleedBackground(`linear-gradient(${PAGE_BG} 0 0)`)}
    >
      <Reveal>
        <SectionHeading
          title="막히면 바로 물어보세요, 채팅으로"
          description="프로젝트 팀원과 실시간으로 대화하고, 궁금한 건 1:1로 편하게 물어볼 수 있어요."
        />
      </Reveal>

      {/* 1200px(75rem) 이상: 왼쪽 채팅창 미리보기 600px + 오른쪽 설명 / 그보다 좁으면 위아래로 쌓임 */}
      <div className="grid items-center gap-16 min-[75rem]:grid-cols-[600px_minmax(0,1fr)]">
        <Reveal>
          <ChatPreview />
        </Reveal>

        {/* 설명 3개 + 버튼은 한 묶음으로 같이 떠오르게 */}
        <Reveal delay={120} className="flex flex-col items-start gap-10">
          <ol className="flex flex-col gap-7">
            {FEATURES.map((f) => (
              <li key={f.no} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-surface) font-mono text-[15px] font-bold text-(--color-text-brand)">
                  {f.no}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[20px] leading-[1.35] font-bold text-(--color-text-primary)">
                    {f.title}
                  </h3>
                  <p className="text-[14px] leading-[1.55] text-(--color-text-secondary)">
                    {f.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {/* 채팅은 로그인이 필요해요: 로그인 전이면 로그인 화면으로 */}
          <LoginRequiredLink
            href="/chat"
            className={buttonClassName({
              variant: 'primary',
              size: 'lg',
              className: buttonHover.primary,
            })}
          >
            채팅 시작하기
          </LoginRequiredLink>
        </Reveal>
      </div>
    </section>
  );
}
