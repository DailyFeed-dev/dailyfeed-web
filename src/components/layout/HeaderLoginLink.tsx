import Link from 'next/link';

import { buttonClassName } from '@/components/common/Button';

/**
 * 로그인 전 헤더 오른쪽: "로그인/회원가입" 버튼 하나
 * - 로그인 화면에서 회원가입으로도 갈 수 있어서, 두 버튼으로 나누지 않고 로그인 화면(/login)으로 보내요.
 * - 로그인 · 회원가입 화면은 로그인 담당(auth) 화면이라 여기서는 주소로 연결만 해요.
 */
export default function HeaderLoginLink() {
  return (
    <Link
      href="/login"
      className={buttonClassName({
        variant: 'primary',
        size: 'md',
        className: 'transition-colors hover:bg-[#4B3FD6]',
      })}
    >
      로그인/회원가입
    </Link>
  );
}
