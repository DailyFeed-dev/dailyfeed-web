import type { ReactNode } from 'react';

type AuthNoticeProps = {
  children: ReactNode;
  /** 바깥 여백 등 위치 조정용 */
  className?: string;
};

/** 연보라 배경의 안내 박스입니다. (Figma 05 "이메일 안내") */
export default function AuthNotice({ children, className }: AuthNoticeProps) {
  return (
    <div
      className={`rounded-[10px] bg-(--color-bg-brand-soft) px-[17px] py-4 text-[13px] leading-[19px] text-[#665d9d] ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
