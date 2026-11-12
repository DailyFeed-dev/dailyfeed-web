'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 스크롤해서 화면에 들어오면 아래에서 살짝 떠오르며 나타나는 상자.
 *
 * - 화면에 들어왔는지는 브라우저 기본 기능 IntersectionObserver 로 확인해요. (추가 라이브러리 없음)
 * - 한 번 나타나면 다시 숨지 않아요.
 * - 운영체제에서 "동작 줄이기"를 켠 사용자에게는 움직임 없이 바로 보여요. (motion-reduce)
 * - 섹션 자체는 서버 컴포넌트로 두고, 움직임이 필요한 부분만 이 컴포넌트로 감싸요. (Next.js 방식)
 *
 * @param delay 나타나기 전에 기다릴 시간(ms). 카드 여러 장을 순서대로 띄울 때 씁니다.
 * @param className 감싸는 div 에 그대로 붙어요. (레이아웃 클래스를 여기에 주면 이 div 가 그 역할을 해요)
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      // 요소가 화면 아래쪽에서 10% 정도 올라왔을 때 시작
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,translate] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
