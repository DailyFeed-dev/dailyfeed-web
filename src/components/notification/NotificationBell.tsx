'use client';

import { useRouter } from 'next/navigation';
// ... 기존에 임포트하신 다른 내용들

export default function NotificationBell() {
  const router = useRouter();

  // 🔔 종 아이콘을 클릭했을 때 실행되는 핸들러 (혹은 직접 onClick에 연결된 함수)
  const handleBellClick = () => {
    // 1. 토큰이 있는지 확인
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('dailyfeed.accessToken') : null;

    // 2. 로그인 전(토큰 없음)이라면 로그인 페이지로 이동!
    if (!token) {
      router.push('/login');
      return; // 더 이상 알림창이 열리지 않도록 중단
    }

    // 3. 로그인 후(토큰 있음)라면 원래대로 알림 목록 토글/조회 로직 실행
    // 예: setIsOpen((prev) => !prev);
  };

  return (
    // 유저님이 만드신 종 아이콘 버튼 컴포넌트의 onClick에 위 함수를 연결해 주세요!
    <button onClick={handleBellClick} aria-label="알림">
      {/* 종 아이콘 SVG 등등... */}
    </button>
  );
}
