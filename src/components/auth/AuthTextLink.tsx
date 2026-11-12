import Link from 'next/link';
import type { ComponentProps } from 'react';

/** 보라색 텍스트 링크 모양입니다. 페이지 이동이 아닌 동작(예: 인증번호 다시 보내기)은 <button> 에 이 클래스를 씁니다. */
export const authTextLinkClassName =
  'text-sm font-medium text-(--color-text-brand) hover:underline';

/** Auth 화면의 보라색 텍스트 링크입니다. (예: 로그인으로 돌아가기, 이메일 다시 입력하기) */
export default function AuthTextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`${authTextLinkClassName} ${className ?? ''}`} />;
}
