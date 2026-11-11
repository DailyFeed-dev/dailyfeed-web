import type { ReactNode } from 'react';

/**
 * 온보딩 섹션 제목 묶음: 경로 표시(~/dailyfeed/...) + 큰 제목 + 설명 한 줄
 * ⚠️ 40px 섹션 제목은 팀 텍스트 스타일에 없는 크기예요. (Display 스타일 추가 요청 필요)
 */
export default function SectionHeading({
  path,
  title,
  description,
}: {
  path: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[14px] leading-[1.5] font-medium text-(--color-text-brand)">
        {path}
      </p>
      <h2 className="text-[32px] leading-tight font-bold text-(--color-text-primary) sm:text-[40px]">
        {title}
      </h2>
      {description && (
        <p className="text-[16px] leading-[1.5] text-(--color-text-secondary)">{description}</p>
      )}
    </div>
  );
}
