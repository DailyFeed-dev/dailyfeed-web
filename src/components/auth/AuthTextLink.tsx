import Link from 'next/link';
import type { ComponentProps } from 'react';

/** Auth 화면의 보라색 텍스트 링크입니다. (예: 로그인으로 돌아가기, 이메일 다시 입력하기) */
export default function AuthTextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`text-sm font-medium text-(--color-text-brand) hover:underline ${className ?? ''}`}
    />
  );
}
