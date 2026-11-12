import type { ReactNode } from 'react';

type AuthCardProps = {
  /** 제목 위 작은 영문 라벨 (예: WELCOME BACK) */
  eyebrow: string;
  title: string;
  description?: string;
  /** 폼이나 안내 문구 등 화면별 본문 */
  children: ReactNode;
  /** 구분선 아래에 놓이는 영역 (예: 회원가입 링크) */
  footer?: ReactNode;
};

/**
 * Auth 화면 오른쪽의 흰색 카드입니다. 7개 Auth 화면이 제목·본문·하단 영역만 바꿔서 사용합니다.
 * 에러 문구가 생기면 늘어나도록 높이는 최소값만 정합니다.
 */
export default function AuthCard({ eyebrow, title, description, children, footer }: AuthCardProps) {
  return (
    <section className="rounded-[20px] border border-(--color-border-default) bg-white p-6 break-keep lg:min-h-[730px] lg:px-[54px] lg:py-[55px]">
      <p className="text-[13px] leading-4 font-semibold text-[#6b5ff2]">{eyebrow}</p>
      <h1 className="mt-[19px] text-[30px] leading-[43px] font-bold">{title}</h1>
      {description && (
        <p className="mt-[9px] text-base leading-[23px] text-[#858396]">{description}</p>
      )}

      <div className="mt-[45px]">{children}</div>

      {footer && (
        <div className="mt-[43px] border-t border-(--color-border-default) pt-8">{footer}</div>
      )}
    </section>
  );
}
