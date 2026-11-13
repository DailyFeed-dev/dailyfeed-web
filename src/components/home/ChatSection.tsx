import Badge from '@/components/common/Badge';
import Icon from '@/components/common/Icon';

import { fullBleedBackground, PAGE_BG } from './fullBleed';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

// 오른쪽 설명: 실제 채팅 화면에 있는 기능만 적었어요. (1:1 대화 · 친구 요청/수락 · TIL 프로필에서 바로 채팅 · 안 읽은 메시지 수)
const FEATURES = [
  { no: '01', title: '1:1 대화', desc: '궁금한 건 친구에게 1:1로 편하게 물어봐요.' },
  {
    no: '02',
    title: '친구 맺고 바로 시작',
    desc: '친구 요청을 보내고 상대가 수락하면 대화를 시작할 수 있어요.',
  },
  {
    no: '03',
    title: '글에서 바로 말 걸기',
    desc: 'TIL 작성자 프로필에서 친구 추가와 채팅을 바로 할 수 있어요.',
  },
  {
    no: '04',
    title: '안 읽은 메시지 표시',
    desc: '대화 목록에서 안 읽은 메시지 수를 한눈에 확인해요.',
  },
];

// 채팅창 예시 대화 (소개용 고정 문구 · API 필요 없음)
// 내가 보낸 메시지는 mine 으로 오른쪽 말풍선, 상대 메시지는 왼쪽 말풍선이에요.
// 이름 자리에는 실제로 닉네임(가입 때 입력)이 보여서 예시도 닉네임으로 적었어요.
const PEER = '넥스트장인';
const MESSAGES: { text: string; time: string; mine?: boolean }[] = [
  { text: 'TIL 글 잘 봤어요! useEffect 부분 질문 하나 해도 될까요?', time: '오후 2:10' },
  { text: '그럼요, 편하게 물어보세요!', time: '오후 2:11', mine: true },
  { text: '의존성 배열에 객체를 넣으면 계속 다시 실행되는데 왜 그런 걸까요?', time: '오후 2:12' },
];

/**
 * 왼쪽: 실제 1:1 채팅 화면을 작게 옮긴 예시 (TIL · 게시판 섹션과 같은 방식)
 * - 뒤: 채팅방 (상대 닉네임 · 대화 · 입력칸)
 * - 앞: 대화 목록의 한 줄(안 읽은 메시지 수 배지)이 창 밖으로 살짝 튀어나와 떠 있어요
 * 구성은 chat/ChatRoomHeader · MessageList · ConversationItem 과 같아요.
 */
function ChatScreenMock() {
  return (
    <div className="relative flex flex-col sm:pt-8 sm:pr-10">
      {/* 뒤: 1:1 채팅방 */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) shadow-[0_12px_32px_rgba(97,87,233,0.10)]">
        {/* 상대 닉네임 (1:1 대화방 머리말) */}
        <div className="flex items-center gap-3 border-b border-(--color-border-default) px-6 py-4">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-(--color-bg-brand-muted) text-[12px] font-semibold text-(--color-text-brand)"
          >
            {PEER.slice(0, 1)}
          </span>
          <p className="text-[15px] leading-[1.5] font-semibold text-(--color-text-primary)">
            {PEER}
          </p>
          <span className="rounded-full bg-(--color-bg-brand-soft) px-2 py-0.5 text-[11px] leading-[1.5] font-medium text-(--color-text-brand)">
            친구
          </span>
        </div>

        {/* 대화 */}
        <ul className="flex flex-col gap-4 px-6 pt-6 pb-5">
          {MESSAGES.map((m) =>
            m.mine ? (
              <li key={m.text} className="flex flex-col items-end gap-1">
                <p className="max-w-[80%] rounded-2xl rounded-br-md bg-(--color-bg-brand) px-4 py-2.5 text-[14px] leading-[1.55] text-(--color-text-on-brand)">
                  {m.text}
                </p>
                <span className="text-[11px] leading-[1.45] text-(--color-text-disabled)">
                  {m.time}
                </span>
              </li>
            ) : (
              <li key={m.text} className="flex flex-col items-start gap-1">
                <p className="max-w-[80%] rounded-2xl rounded-tl-md bg-[#F6F5FB] px-4 py-2.5 text-[14px] leading-[1.55] text-(--color-text-primary)">
                  {m.text}
                </p>
                <span className="text-[11px] leading-[1.45] text-(--color-text-disabled)">
                  {m.time}
                </span>
              </li>
            ),
          )}
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

      {/* 앞: 창 밖으로 튀어나온 대화 목록 한 줄 (안 읽은 메시지 수) · 휴대폰처럼 좁은 화면에서는 창 위에 따로 놓여요 */}
      <div className="order-first mb-3 ml-auto flex w-64 items-center gap-3 rounded-2xl border border-(--color-border-brand-soft) bg-(--color-bg-surface) px-4 py-3 shadow-[0_2px_6px_rgba(31,29,43,0.05),0_16px_36px_rgba(97,87,233,0.16)] sm:absolute sm:top-0 sm:right-0 sm:mb-0">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--color-bg-brand-muted) text-[13px] font-semibold text-(--color-text-brand)"
        >
          새
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-[1.5] font-semibold text-(--color-text-primary)">
            새벽코더
          </p>
          <p className="truncate text-[12px] leading-[1.5] text-(--color-text-muted)">
            프로젝트 회고 같이 봐 주실래요?
          </p>
        </div>
        <Badge tone="solid">2</Badge>
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
          description="궁금한 게 생기면 친구에게 1:1로 편하게 물어보세요."
        />
      </Reveal>

      {/* 1200px(75rem) 이상: 왼쪽 1:1 채팅 화면 예시 600px + 오른쪽 설명 / 그보다 좁으면 위아래로 쌓임 */}
      <div className="grid items-center gap-16 min-[75rem]:grid-cols-[600px_minmax(0,1fr)]">
        <Reveal>
          <ChatScreenMock />
        </Reveal>

        {/* 설명 4개는 한 묶음으로 같이 떠오르게 · 넓은 화면에서는 오른쪽 끝에 붙이되,
            오른쪽 여백(pr-16)만큼 예시 쪽으로 조금 당겨서 간격을 줄여요 (게시판 섹션의 pl-16 과 좌우 대칭) */}
        <Reveal delay={120} className="min-[75rem]:justify-self-end">
          <ol className="flex flex-col gap-9 min-[75rem]:pr-16">
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
        </Reveal>
      </div>
    </section>
  );
}
