import type { ReactNode } from 'react';

// 오류 안내 화면의 공통 모양 — 큰 표시(404, ! 등), 제목, 안내문, 버튼 줄
// (디자인: 오류 안내. 404 화면과 글을 불러오지 못한 화면이 함께 씁니다)
export default function BoardErrorScreen({
  mark,
  title,
  description,
  children,
}: {
  mark: string;
  title: string;
  /** 줄마다 한 문장씩 보여 줍니다. */
  description: string[];
  /** 버튼들 */
  children: ReactNode;
}) {
  return (
    // 아래 여백(180px)을 위 여백(80px)보다 100px 크게 두어, 세로 가운데보다 50px 위에 보이게 합니다. (404 화면과 오류 화면 공통)
    <div className="flex flex-1 flex-col items-center justify-center gap-6 pt-20 pb-[180px]">
      <p
        aria-hidden="true"
        className="text-center text-[112px] leading-[124px] font-bold tracking-[-3.36px] text-(--color-text-brand)"
      >
        {mark}
      </p>
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-[30px] leading-[1.3] font-bold tracking-[-0.3px] text-(--color-text-primary)">
          {title}
        </h1>
        <p className="text-sm leading-[1.55] text-(--color-text-secondary)">
          {description.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
