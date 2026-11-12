import LineIcon from './LineIcon';

const pillBase =
  'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border py-2 pr-[17px] pl-[15px] text-sm leading-[1.4] font-semibold whitespace-nowrap transition-[background-color,filter] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) disabled:cursor-progress disabled:opacity-70';

const TONE_CLASS = {
  // Friend=No: 보라색 채움
  primary: `${pillBase} border-(--color-border-brand) bg-(--color-bg-brand) text-white hover:enabled:brightness-[0.94]`,
  // Friend=Yes: 흰 배경 + 회색 테두리
  outline: `${pillBase} border-(--color-border-strong) bg-white text-(--color-text-secondary) hover:enabled:bg-(--color-bg-subtle)`,
};

export type FriendButtonView = {
  label: string;
  icon: 'user-plus' | 'user-check';
  tone: keyof typeof TONE_CLASS;
  /** 스크린 리더용 설명 (누르면 무슨 일이 일어나는지) */
  ariaLabel: string;
};

export type FriendButtonProps = {
  /** 관계를 불러오는 중이면 버튼 크기만큼 자리만 잡아 둡니다. */
  loading: boolean;
  /** 보여 줄 버튼. null 이면(차단 · 불러오기 실패) 아무것도 그리지 않습니다. */
  view: FriendButtonView | null;
  busy: boolean;
  onClick: () => void;
};

/**
 * 프로필 팝오버의 친구 버튼 (디자인: Profile Popover 599:2983 의 Friend=No / Friend=Yes)
 * 화면만 그립니다. 관계 조회 · 요청 같은 동작은 hooks/useFriendRelation 이 맡습니다.
 */
export default function FriendButton({ loading, view, busy, onClick }: FriendButtonProps) {
  if (loading) {
    return (
      <span
        aria-hidden="true"
        className="h-[38px] w-[104px] shrink-0 animate-pulse rounded-full bg-(--color-bg-subtle)"
      />
    );
  }
  if (!view) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={view.ariaLabel}
      className={TONE_CLASS[view.tone]}
    >
      <LineIcon name={view.icon} />
      {view.label}
    </button>
  );
}
