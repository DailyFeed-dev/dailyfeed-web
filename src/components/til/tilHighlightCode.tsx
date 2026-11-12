import type { ReactNode } from 'react';

const KEYWORDS = new Set([
  'export',
  'default',
  'async',
  'await',
  'function',
  'const',
  'let',
  'var',
  'return',
  'import',
  'from',
  'if',
  'else',
  'for',
  'while',
  'new',
  'class',
  'extends',
  'type',
  'interface',
  'true',
  'false',
  'null',
  'undefined',
]);

// 디자인의 코드 색상
const TOKEN = {
  keyword: 'text-[#b6a8ff]',
  fn: 'text-[#7fd1ff]',
  component: 'text-[#ffc987]',
  string: 'text-[#9be3b0]',
  comment: 'text-[#6f6d85]',
};

/**
 * 코드 블록용 간단한 JS/TS 색칠기입니다. (완전한 파서는 아니고, TIL 예제 코드에 충분한 정도)
 * 별도 하이라이터 패키지 없이 디자인의 코드 색을 재현합니다.
 */
export function highlightCode(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re =
    /(\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|(<\/?)([A-Z][\w.]*)|\b([A-Za-z_$][\w$]*)\b(?=\s*\()|\b([A-Za-z_$][\w$]*)\b/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    if (m[1]) {
      out.push(
        <span key={k++} className={TOKEN.comment}>
          {m[1]}
        </span>,
      );
    } else if (m[2]) {
      out.push(
        <span key={k++} className={TOKEN.string}>
          {m[2]}
        </span>,
      );
    } else if (m[4]) {
      out.push(
        m[3],
        <span key={k++} className={TOKEN.component}>
          {m[4]}
        </span>,
      );
    } else if (m[5]) {
      out.push(
        <span key={k++} className={KEYWORDS.has(m[5]) ? TOKEN.keyword : TOKEN.fn}>
          {m[5]}
        </span>,
      );
    } else if (m[6]) {
      out.push(
        KEYWORDS.has(m[6]) ? (
          <span key={k++} className={TOKEN.keyword}>
            {m[6]}
          </span>
        ) : (
          m[6]
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

/** 코드 첫 줄의 `// path/to/file.tsx` 주석을 파일 이름으로 떼어 냅니다. */
export function splitFileName(code: string): { fileName?: string; body: string } {
  const lines = code.replace(/\n$/, '').split('\n');
  const match = /^\s*\/\/\s*([\w./@-]+\.\w+)\s*$/.exec(lines[0] ?? '');
  return match
    ? { fileName: match[1], body: lines.slice(1).join('\n') }
    : { body: lines.join('\n') };
}
