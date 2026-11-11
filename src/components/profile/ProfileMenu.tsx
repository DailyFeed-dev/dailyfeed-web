import Link from 'next/link';

import { UserIcon } from '@/components/common/icons';

/**
 * 헤더 오른쪽의 프로필 버튼입니다. (담당: 개인 프로필 기능, 이슈 #9)
 * 헤더 파일을 고치지 않고 이 컴포넌트만 수정하면 헤더에 반영됩니다.
 * 지금은 기본 아바타만 보여줍니다. 로그인 상태(프로필 이미지)와 연결해 주세요.
 */
export default function ProfileMenu() {
  return (
    <Link
      href="/profile"
      aria-label="프로필"
      className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200"
    >
      <UserIcon className="size-5" />
    </Link>
  );
}
