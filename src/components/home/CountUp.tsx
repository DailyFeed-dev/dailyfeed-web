'use client';

import { useEffect, useRef, useState } from 'react';

/** 빠르게 출발해서 끝에서 천천히 멈추는 움직임 (easeOutExpo) */
const easeOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const format = (n: number) => n.toLocaleString('ko-KR');

/**
 * 숫자가 0부터 빠르게 올라가다가 실제 값에서 멈추는 숫자.
 * - 화면에 보일 때 한 번만 움직여요. (스크롤로 다시 와도 반복하지 않음)
 * - 처음엔 자릿수가 휙휙 바뀌며 섞이는 느낌, 끝에서 천천히 고정돼요.
 * - 숫자 폭이 바뀌어 카드가 흔들리지 않게, 최종 숫자 크기만큼 자리를 미리 잡아 둬요.
 * - 화면 읽기 프로그램에는 최종 숫자만 읽혀요. "동작 줄이기" 사용자에게는 처음부터 최종 숫자.
 * - 나중에 API 로 실제 숫자를 받으면 value 만 바꿔 주면 돼요.
 */
export default function CountUp({
  value,
  duration = 1800,
  delay = 0,
}: {
  /** 최종 숫자 */
  value: number;
  /** 움직이는 시간(ms) */
  duration?: number;
  /** 화면에 보인 뒤 기다릴 시간(ms). 카드가 떠오르는 효과와 맞추는 용도 */
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let timer = 0;
    // 화면에 보이기 전에는 0 으로 맞춰 둬요 (다음 화면 그리기 때)
    frame = requestAnimationFrame(() => setShown(0));

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setShown(Math.round(value * easeOut(t)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} className="inline-grid tabular-nums">
      {/* 화면 읽기용 최종 숫자 */}
      <span className="sr-only">{format(value)}</span>
      {/* 자리 잡기용 (보이지 않음): 최종 숫자 폭만큼 공간 확보 */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {format(value)}
      </span>
      {/* 움직이는 숫자: 오른쪽 정렬이라 자릿수가 늘어도 끝(+)에 붙어 있어요 */}
      <span aria-hidden="true" className="col-start-1 row-start-1 text-right">
        {format(shown)}
      </span>
    </span>
  );
}
