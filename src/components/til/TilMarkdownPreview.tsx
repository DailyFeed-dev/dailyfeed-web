import TilMarkdown from './TilMarkdown';
import { TilIcon } from './TilTempUi';

type Props = {
  title: string;
  body: string;
  author: string;
  /** "2026.11.10" */
  date: string;
  day?: number;
};

/** 작성 화면 오른쪽 미리보기 (디자인: Preview 75:8232) */
export default function TilMarkdownPreview({ title, body, author, date, day }: Props) {
  return (
    <article className="flex flex-col gap-5">
      <div className="flex items-center gap-1.5 text-[13px] leading-[1.4] font-semibold text-[#9a99a8]">
        <TilIcon name="eye" />
        <span>미리보기</span>
      </div>

      <h1
        className={`text-[32px] leading-[1.3] font-bold wrap-anywhere ${title ? 'text-[#1f1d2b]' : 'text-[#bdbcc8]'}`}
      >
        {title || '제목을 입력하세요'}
      </h1>

      <div className="flex items-center gap-2 text-sm leading-[1.4] font-medium text-[#6b6a7b]">
        <span className="font-semibold text-[#1f1d2b]">{author}</span>
        <span className="text-[#9a99a8]">·</span>
        <span>{date}</span>
        {day !== undefined && (
          <>
            <span className="text-[#9a99a8]">·</span>
            <span>Day {day}</span>
          </>
        )}
      </div>

      <TilMarkdown source={body} variant="preview" />
    </article>
  );
}
