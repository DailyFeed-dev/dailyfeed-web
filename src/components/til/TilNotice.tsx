import Link from 'next/link';

import { buttonClassName } from '@/components/common/Button';

import { tilLoginHref } from './tilBoardUrl';

type Props = {
  message: string;
  /** 있으면 로그인 버튼을 함께 보여줍니다. 로그인하면 이 주소(지금 보던 TIL 화면)로 돌아옵니다. */
  loginReturnTo?: string;
  /** 아래에 보여줄 링크 (예: 게시판으로) */
  link?: { href: string; label: string };
};

/** 빈 목록 · 에러 · 로그인 필요 안내 */
export default function TilNotice({ message, loginReturnTo, link }: Props) {
  return (
    <div
      role={loginReturnTo ? 'alert' : 'status'}
      className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[#e2defd] bg-white px-5 py-15 text-center"
    >
      <p className="text-[15px] text-[#6b6a7b]">{message}</p>
      {loginReturnTo && (
        <Link
          href={tilLoginHref(loginReturnTo)}
          className={buttonClassName({ variant: 'primary', size: 'md' })}
        >
          로그인하기
        </Link>
      )}
      {link && (
        <Link
          href={link.href}
          className="text-sm font-semibold text-[#4b3fd6] underline underline-offset-2"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
