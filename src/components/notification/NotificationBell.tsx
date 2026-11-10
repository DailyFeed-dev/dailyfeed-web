import Link from 'next/link';

import { BellIcon } from '@/components/common/icons';

/**
 * 헤더 오른쪽의 알림 아이콘입니다. (담당: 알림 기능, 이슈 #6)
 * 헤더 파일을 고치지 않고 이 컴포넌트만 수정하면 헤더에 반영됩니다.
 * 빨간 점은 임시 표시입니다. 읽지 않은 알림 여부와 연결해 주세요.
 */
export default function NotificationBell() {
  return (
    <Link
      href="/notifications"
      aria-label="알림"
      className="relative flex size-12 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 transition-colors hover:bg-zinc-100"
    >
      <BellIcon className="size-5.5" />
      <span className="absolute top-3 right-3.5 size-2 rounded-full bg-red-600 ring-2 ring-white" />
    </Link>
  );
}
