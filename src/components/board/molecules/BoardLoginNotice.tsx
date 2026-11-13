import Link from 'next/link';
import { buttonClassName } from '@/components/common/Button';
import { boardLoginHref } from '../boardLogin';

// 로그인이 필요할 때 보여 주는 안내와 로그인 버튼입니다. 로그인하면 returnTo 로 돌아옵니다.
export default function BoardLoginNotice({
  message,
  returnTo,
}: {
  message: string;
  returnTo: string;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 border-b border-zinc-200 px-5 py-16 text-center"
    >
      <p className="text-sm text-[#6C6980]">{message}</p>
      <Link
        href={boardLoginHref(returnTo)}
        className={buttonClassName({ variant: 'primary', size: 'md' })}
      >
        로그인하기
      </Link>
    </div>
  );
}
