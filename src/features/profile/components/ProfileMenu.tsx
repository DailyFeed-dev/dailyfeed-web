import Link from 'next/link';

/**
 * 헤더 오른쪽의 프로필 메뉴입니다. (담당: 개인 프로필 기능, 이슈 #9)
 * 헤더 파일을 고치지 않고 이 컴포넌트만 수정하면 헤더에 반영됩니다.
 */
export default function ProfileMenu() {
  return (
    <Link href="/profile" className="text-sm hover:underline">
      프로필
    </Link>
  );
}
