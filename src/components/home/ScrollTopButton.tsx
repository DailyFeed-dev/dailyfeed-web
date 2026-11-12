'use client';

import { useEffect, useState } from 'react';

import Icon from '@/components/common/Icon';

/** 이만큼(px) 내려가면 버튼이 나타나요 */
const SHOW_AFTER = 400;

/**
 * 오른쪽 아래 "맨 위로" 버튼.
 * - 맨 위에서는 숨어 있다가, 조금 내려가면 부드럽게 나타나요.
 * - 누르면 부드럽게 맨 위로 올라가요. ("동작 줄이기" 사용자에게는 바로 이동)
 * - 화살표: 공통 Icon 의 arrow-left 를 90도 돌려서 위쪽 화살표로 씁니다. (공통 Icon 에 위쪽 화살표가 없음)
 * - 색: Figma gray/900 (#1F1D2B) · 팀 색 변수에 배경용이 없어 값으로 적었어요.
 */
export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER);
    // 새로고침으로 중간 위치에서 시작한 경우도 반영 (다음 화면 그리기 때 한 번 확인)
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로"
      title="맨 위로"
      // 숨어 있을 때는 키보드 Tab 으로도 선택되지 않게
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed right-6 bottom-6 z-20 flex size-14 items-center justify-center rounded-full bg-[#1F1D2B] text-(--color-text-on-brand) shadow-[0_8px_24px_rgba(31,29,43,0.25)] transition-[opacity,translate,background-color] duration-300 hover:bg-[#2E2D3A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) motion-reduce:transition-none sm:right-8 sm:bottom-8 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Icon name="arrow-left" size={24} className="rotate-90" />
    </button>
  );
}
