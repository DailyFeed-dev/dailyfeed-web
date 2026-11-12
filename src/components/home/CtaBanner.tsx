import Link from 'next/link';

import { buttonClassName } from '@/components/common/Button';

import { fullBleedBackground, PAGE_BG } from './fullBleed';
import { buttonHover } from './buttonHover';
import Reveal from './Reveal';

// ⑦ 마지막 시작하기 띠: 보라 그라데이션 박스 (왼쪽 아래 모서리가 크게 둥근 모양)
export default function CtaBanner() {
  return (
    <section
      className="pb-24 lg:pb-30"
      style={fullBleedBackground(`linear-gradient(${PAGE_BG} 0 0)`)}
    >
      <Reveal className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl rounded-bl-[120px] bg-linear-to-r from-[#4B3FD6] via-[#6157E9] via-55% to-[#8A7FF3] p-10 lg:flex-row lg:items-center lg:p-16">
        {/* 배경 격자 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(to left, black 20%, transparent 70%)',
          }}
        />

        <div className="relative flex flex-col gap-3 text-(--color-text-on-brand)">
          {/* ⚠️ 40px 제목은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 요청 필요) */}
          <h2 className="text-[32px] leading-tight font-bold sm:text-[40px]">
            오늘의 첫 기록을 남겨 보세요
          </h2>
          <p className="text-[16px] leading-[1.5] font-normal opacity-90">
            작은 TIL 하나, 나눈 정보 하나가 성장의 시작이에요.
          </p>
        </div>

        {/* 시안은 투명 버튼이지만, 공통 Button 에 보라 배경용 버튼이 없어 Outline 을 씁니다. */}
        <div className="relative flex shrink-0 gap-3">
          {/* FAQ 화면으로 이동 (누구나 볼 수 있어 로그인 필요 없음)
              마우스를 올리면 한 단계 진한 색 + 살짝 떠오름 (누를 수 있다는 느낌) */}
          <Link
            href="/faq"
            className={buttonClassName({
              variant: 'outline',
              size: 'lg',
              className: buttonHover.outline,
            })}
          >
            FAQ 보기
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
