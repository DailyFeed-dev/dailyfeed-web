import Link from 'next/link';

import { buttonClassName } from '@/components/common/Button';

import { fullBleedBackground, PAGE_BG } from './fullBleed';
import { buttonHover } from './buttonHover';
import LoginRequiredLink from './LoginRequiredLink';
import Reveal from './Reveal';

// ④ 마지막 시작하기 띠: 보라 그라데이션 박스 (왼쪽 아래 모서리가 크게 둥근 모양)
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
          <p className="font-mono text-[14px] leading-[1.55]">{'// ready to commit?'}</p>
          {/* ⚠️ 40px 제목은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 요청 필요) */}
          <h2 className="text-[32px] leading-tight font-bold sm:text-[40px]">
            오늘의 첫 기록을 남겨 보세요
          </h2>
          {/* ⚠️ 회원가입이 관리자 승인제인지 확인 필요 (승인제면 "1분" 문구 수정) */}
          <p className="text-[16px] leading-[1.5] font-normal opacity-90">
            가입은 1분이면 끝나요. 작은 TIL 하나가 성장의 시작이에요.
          </p>
        </div>

        {/* 시안은 흰 버튼 · 투명 버튼이지만, 공통 Button 에 보라 배경용 버튼이 없어 Soft · Outline 을 씁니다. */}
        <div className="relative flex shrink-0 gap-3">
          {/* TODO: 회원가입 페이지 주소를 로그인 담당(#4)과 확인 */}
          {/* 마우스를 올리면 한 단계 진한 색 + 살짝 떠오름 (누를 수 있다는 느낌) */}
          <Link
            href="/login"
            className={buttonClassName({
              variant: 'soft',
              size: 'lg',
              className: buttonHover.soft,
            })}
          >
            시작하기
          </Link>
          {/* FAQ 는 로그인이 필요해요: 로그인 전이면 로그인 화면으로 */}
          <LoginRequiredLink
            href="/faq"
            className={buttonClassName({
              variant: 'outline',
              size: 'lg',
              className: buttonHover.outline,
            })}
          >
            FAQ 보기
          </LoginRequiredLink>
        </div>
      </Reveal>
    </section>
  );
}
