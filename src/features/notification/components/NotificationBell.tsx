import Link from 'next/link';

/**
 * 헤더 오른쪽의 알림 아이콘입니다. (담당: 알림 기능, 이슈 #6)
 * 헤더 파일을 고치지 않고 이 컴포넌트만 수정하면 헤더에 반영됩니다.
 */
export default function NotificationBell() {
  return (
    <Link href="/notifications" aria-label="알림" className="text-sm">
      🔔
    </Link>
  );
}
