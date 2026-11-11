import type { ComponentProps } from 'react';

/**
 * Auth 화면 전용 버튼입니다. (Figma: Auth Components · Button)
 * 팀 공용 Button 이 생기면 import 만 바꿀 수 있도록 button 기본 속성만 받습니다.
 */
export default function AuthButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={`flex h-14 w-full cursor-pointer items-center justify-center rounded-[10px] bg-(--auth-primary) text-base font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--auth-primary) disabled:cursor-not-allowed disabled:bg-[#e5e2f1] disabled:text-[#a5a3b2] ${className ?? ''}`}
    />
  );
}
