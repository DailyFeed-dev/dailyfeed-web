import Link from 'next/link';

import { ChevronDownIcon } from '@/components/common/icons';

/**
 * 헤더 오른쪽의 프로필 메뉴입니다. (담당: 개인 프로필 기능, 이슈 #9)
 * 헤더 파일을 고치지 않고 이 컴포넌트만 수정하면 헤더에 반영됩니다.
 * 아바타와 이름은 임시 표시입니다. 로그인한 사용자 정보와 연결해 주세요.
 */
export default function ProfileMenu() {
  return (
    <Link
      href="/profile"
      className="flex items-center gap-3 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-zinc-100"
    >
      <span className="size-11 shrink-0 rounded-full bg-zinc-300" aria-hidden="true" />
      <span className="hidden font-semibold whitespace-nowrap text-zinc-950 sm:inline">
        내 프로필
      </span>
      <ChevronDownIcon className="size-5 text-zinc-700" />
    </Link>
  );
}
