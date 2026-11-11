import CtaBanner from './CtaBanner';
import FeatureSection from './FeatureSection';
import HeroSection from './HeroSection';
import OnboardingFooter from './OnboardingFooter';
import StepsSection from './StepsSection';

/**
 * 메인화면 (이슈 #8) — 온보딩 형식
 * 소개 · 기능 · 3단계 · 시작하기 순서로 보여 주는 화면이라 데이터를 불러오지 않습니다.
 * 그래서 'use client' 없이 서버 컴포넌트로 만들었어요. (Next.js 기본 방식)
 *
 * 디자인: Figma Web Design · 최동하 · 온보딩 시안
 * 색과 글자 크기는 Figma 디자인 시스템(03 컬러 · 02 타이포그래피) 값을 그대로 적었어요.
 *   예) bg-[#6157E9] = Figma brand/500, text-[14px] leading-[1.55] = Body/M
 *   팀에서 코드용 색 · 글자 변수를 정하면 그 이름으로 바꿉니다. (공용 파일 globals.css 는 건드리지 않음)
 * ⚠️ 시안의 큰 제목(56 · 64 · 40px)은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 필요)
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <StepsSection />
      <CtaBanner />
      <OnboardingFooter />
    </>
  );
}
