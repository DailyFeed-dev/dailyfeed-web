'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import type { TilProfile } from '@/types/til';

import TilAvatar from './TilAvatar';
import { TilIcon } from './TilTempUi';

type PopoverProps = {
  profile: TilProfile;
  /** 채팅 버튼 링크 (chatHref 또는 onChat 중 하나) */
  chatHref?: string;
  onChat?: () => void;
  id?: string;
  /**
   * true: 트리거 아래에 떠서 다른 내용 위에 겹쳐 보입니다. (자리를 차지하지 않음)
   * false: 일반 요소처럼 자리를 차지합니다.
   */
  floating?: boolean;
  className?: string;
  style?: CSSProperties;
};

const chatClass =
  'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-(--color-border-brand-soft) bg-(--color-bg-brand-soft) py-2 pr-[17px] pl-[15px] text-sm leading-[1.4] font-semibold text-(--color-text-brand) hover:bg-(--color-bg-brand-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand)';

/**
 * 작성자 · 댓글 작성자의 간단 프로필. '채팅' 버튼으로 채팅을 엽니다.
 * (디자인: Profile Popover 135:4525)
 */
export function TilProfilePopover({
  profile,
  chatHref,
  onChat,
  id,
  floating = false,
  className,
  style,
}: PopoverProps) {
  const chatContent = (
    <>
      <TilIcon name="chat" />
      채팅
    </>
  );

  return (
    <div
      id={id}
      role="dialog"
      aria-label={`${profile.name ?? ''} 프로필`}
      style={style}
      // relative 와 absolute 를 같이 쓰면 relative 가 이겨서 자리를 차지하므로 하나만 붙입니다.
      className={`${floating ? 'absolute top-full left-0 z-50' : 'relative'} flex w-[382px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-[#ecebf2] bg-white text-left shadow-[0_2px_6px_rgba(31,28,43,0.06),0_16px_40px_rgba(31,28,43,0.14)] ${className ?? ''}`}
    >
      {/* 상단 보라색 커버 */}
      <div
        aria-hidden="true"
        className="h-16 bg-[linear-gradient(154.3deg,#4b3fd6_0%,#8b7cf6_74%)]"
      />

      <div className="flex items-center justify-between gap-3 px-5 pt-11 pb-5">
        <div className="flex min-w-0 flex-col gap-0.5 leading-[1.4]">
          <span className="truncate text-lg font-bold text-[#1f1d2b]">{profile.name}</span>
          {profile.handle && (
            <span className="truncate text-[13px] font-medium text-[#9a99a8]">
              {profile.handle}
            </span>
          )}
        </div>
        {chatHref ? (
          <Link href={chatHref} onClick={onChat} className={chatClass}>
            {chatContent}
          </Link>
        ) : (
          <button type="button" onClick={onChat} className={chatClass}>
            {chatContent}
          </button>
        )}
      </div>

      {/* 커버에 걸치는 72px 아바타 (바깥 흰 테두리 4px 포함) */}
      <TilAvatar
        name={profile.name}
        src={profile.avatarUrl}
        size={72}
        background={profile.avatarColor}
        color={profile.avatarTextColor}
        className="absolute top-[23px] left-[15px] border-4 border-white"
      />
    </div>
  );
}

type TriggerProps = Omit<PopoverProps, 'id' | 'className' | 'style'> & {
  /** 트리거 안에 들어갈 내용 (아바타 + 이름 등) */
  children: ReactNode;
  triggerClassName?: string;
  /** 열려 있을 때 트리거에 추가할 클래스 (예: 연보라 배경) */
  openClassName?: string;
  /** 트리거 아래로 떨어뜨릴 거리(px) */
  offset?: number;
  className?: string;
  /** true 면 눌러도 팝오버가 열리지 않습니다. (내 프로필 — 나와 채팅할 일이 없어서) */
  disabled?: boolean;
};

/**
 * 트리거를 누르면 바로 아래에 프로필 팝오버를 띄웁니다.
 * 바깥 클릭 · Esc · 채팅 버튼 클릭 시 닫힙니다.
 *
 * @example
 * <TilProfilePopoverTrigger profile={author} chatHref={tilChatHref(author.id)}>
 *   <TilAvatar name={author.name} size={40} /> {author.name}
 * </TilProfilePopoverTrigger>
 */
export function TilProfilePopoverTrigger({
  children,
  profile,
  chatHref,
  onChat,
  triggerClassName,
  openClassName,
  offset = 8,
  className,
  disabled = false,
}: TriggerProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  // 내 프로필이면 버튼 없이 내용만 보여줍니다. (모양은 같게, 마우스 반응 · 클릭은 없게)
  if (disabled) {
    return (
      <span className={`relative inline-flex ${className ?? ''}`}>
        <span
          className={`pointer-events-none inline-flex items-center rounded-lg text-left ${triggerClassName ?? ''}`}
        >
          {children}
        </span>
      </span>
    );
  }

  return (
    <span ref={wrapRef} className={`relative inline-flex ${className ?? ''}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex cursor-pointer items-center rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) ${
          triggerClassName ?? ''
        } ${open ? (openClassName ?? '') : ''}`}
      >
        {children}
      </button>
      {open && (
        <TilProfilePopover
          id={popoverId}
          profile={profile}
          chatHref={chatHref}
          onChat={() => {
            onChat?.();
            close();
          }}
          floating
          style={{ top: `calc(100% + ${offset}px)` }}
          className="transition-[opacity,translate] duration-150 ease-out starting:-translate-y-1 starting:opacity-0"
        />
      )}
    </span>
  );
}
