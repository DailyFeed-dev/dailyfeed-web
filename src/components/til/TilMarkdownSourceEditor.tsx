'use client';

import { Fragment, useMemo, type KeyboardEvent, type ReactNode, type Ref } from 'react';

// 마크다운 원문 색 (글자 수 · 굵기는 바꾸지 않고 색만 바꿉니다)
const TOK = {
  marker: 'text-[#685cf0]',
  heading: 'text-[#4b3fd6]',
  quote: 'text-[#6b6a7b]',
  inlineCode: 'text-[#d6336c]',
  link: 'text-[#4b3fd6]',
  code: 'text-[#5b5a6e]',
  codeComment: 'text-[#9a99a8]',
};

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`\n]+`)|(\*\*|__|~~)|(!?\[[^\]\n]*\]\([^)\n]*\))/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const cls = m[1] ? TOK.inlineCode : m[2] ? TOK.marker : TOK.link;
    out.push(
      <span key={`${keyPrefix}-${k++}`} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** 원문 영역 색칠. 글자를 더하거나 빼지 않아서 위에 겹친 투명 textarea 와 정확히 맞습니다. */
function highlightMarkdown(source: string): ReactNode[] {
  const lines = source.split('\n');
  let inFence = false;

  return lines.map((line, i) => {
    const key = `l${i}`;
    let content: ReactNode;

    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      content = <span className={TOK.marker}>{line}</span>;
    } else if (inFence) {
      content = <span className={/^\s*\/\//.test(line) ? TOK.codeComment : TOK.code}>{line}</span>;
    } else {
      const heading = /^(#{1,6} )(.*)$/.exec(line);
      const quote = /^(>)( ?)(.*)$/.exec(line);
      const task = /^(\s*[-*+] \[[ xX]\])(.*)$/.exec(line);
      const list = /^(\s*(?:[-*+]|\d+\.))( .*)?$/.exec(line);

      if (heading) {
        content = (
          <>
            <span className={TOK.marker}>{heading[1]}</span>
            <span className={TOK.heading}>{inline(heading[2], key)}</span>
          </>
        );
      } else if (quote) {
        content = (
          <>
            <span className={TOK.marker}>{quote[1]}</span>
            {quote[2]}
            <span className={TOK.quote}>{inline(quote[3], key)}</span>
          </>
        );
      } else if (task) {
        content = (
          <>
            <span className={TOK.marker}>{task[1]}</span>
            {inline(task[2], key)}
          </>
        );
      } else if (list) {
        content = (
          <>
            <span className={TOK.marker}>{list[1]}</span>
            {inline(list[2] ?? '', key)}
          </>
        );
      } else {
        content = inline(line, key);
      }
    }

    return (
      <Fragment key={key}>
        {content}
        {i < lines.length - 1 ? '\n' : null}
      </Fragment>
    );
  });
}

type Props = {
  ref?: Ref<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
  onSelectionChange: (start: number, end: number) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  /** true: 마크다운 모드 (고정폭 글꼴 + 색칠), false: 텍스트 모드 */
  highlight?: boolean;
  placeholder?: string;
};

/**
 * 본문 입력 (디자인: Markdown Source 75:8227)
 * 색칠된 <pre> 위에 투명한 <textarea> 를 겹쳐서, 커서 · 선택 영역이 색과 정확히 맞게 합니다.
 */
export default function TilMarkdownSourceEditor({
  ref,
  value,
  onChange,
  onSelectionChange,
  onKeyDown,
  highlight = true,
  placeholder,
}: Props) {
  const highlighted = useMemo(
    () => (highlight ? highlightMarkdown(value) : value),
    [value, highlight],
  );
  const report = (el: HTMLTextAreaElement) => onSelectionChange(el.selectionStart, el.selectionEnd);

  // pre 와 textarea 가 똑같은 글꼴 · 줄 간격을 써야 커서 위치가 맞습니다.
  const typography = `m-0 border-0 p-0 whitespace-pre-wrap wrap-anywhere [tab-size:2] ${
    highlight ? 'font-mono text-[15px] leading-[1.75]' : 'font-sans text-[17px] leading-[1.8]'
  }`;

  return (
    <div className="relative min-h-80 w-full">
      <pre
        aria-hidden="true"
        className={`${typography} pointer-events-none min-h-80 text-[#2e2d3a]`}
      >
        {value ? highlighted : <span className="text-[#bdbcc8]">{placeholder}</span>}
        {/* 마지막 줄이 줄바꿈으로 끝나도 높이가 맞도록 */}
        {'\n'}
      </pre>
      <textarea
        ref={ref}
        value={value}
        spellCheck={false}
        aria-label="본문"
        onChange={(e) => {
          onChange(e.target.value);
          report(e.target);
        }}
        onSelect={(e) => report(e.currentTarget)}
        onKeyDown={onKeyDown}
        className={`${typography} absolute inset-0 size-full resize-none overflow-hidden bg-transparent text-transparent caret-[#685cf0] outline-none selection:bg-[#685cf0]/20 selection:text-transparent`}
      />
    </div>
  );
}
