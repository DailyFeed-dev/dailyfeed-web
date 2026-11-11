import CtaBanner from './CtaBanner';
import FeatureSection from './FeatureSection';
import HeroSection from './HeroSection';
import OnboardingFooter from './OnboardingFooter';
import ScrollTopButton from './ScrollTopButton';
import StepsSection from './StepsSection';
import WhyBoardSection from './WhyBoardSection';
import WhyTilSection from './WhyTilSection';

/**
 * 메인화면 (이슈 #8) — 온보딩 형식
 * 소개 · 기능 · TIL 필요성 · 게시판 이점 · 3단계 · 시작하기 순서로 보여 주는 화면이라 데이터를 불러오지 않습니다.
 * 그래서 'use client' 없이 서버 컴포넌트로 만들었어요. (Next.js 기본 방식)
 *
 * 디자인: Figma Web Design · 최동하 · 온보딩 시안
 * 공통 코드를 가져다 씁니다. (공용 파일은 수정하지 않음)
 * - 버튼: common/Button 의 buttonClassName · 배지: common/Badge
 * - 색: 팀 색 변수 (globals.css)  예) bg-(--color-bg-brand), text-(--color-text-primary)
 *   팀 변수에 없는 색(페이지 배경 #F6F5FB, 노랑 #E8D156, 어두운 회색 #1F1D2B · #2E2D3A, 보라 단계 등)은
 *   Figma 디자인 시스템 값을 그대로 적었어요. 변수가 추가되면 바꿉니다.
 * - 글자: Figma 텍스트 스타일 값  예) text-[14px] leading-[1.55] = Body/M (코드용 글자 변수는 아직 없음)
 * ⚠️ 시안의 큰 제목(56 · 64 · 40px)은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 필요)
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <WhyTilSection />
      <WhyBoardSection />
      <StepsSection />
      <CtaBanner />
      <OnboardingFooter />
      {/* 오른쪽 아래 "맨 위로" 버튼 (화면에 고정) */}
      <ScrollTopButton />
    </>
  );
}
