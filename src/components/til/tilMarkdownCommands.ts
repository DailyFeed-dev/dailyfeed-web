/**
 * 서식 툴바 · 단축키가 쓰는 텍스트 변환 함수입니다.
 * 지금 값 + 선택 범위를 받아 바뀐 값 + 선택 범위를 돌려주는 순수 함수라 테스트하기 쉽습니다.
 */
export type EditorState = { value: string; start: number; end: number };

export type FormatCommand =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 }
  | { type: 'bold' }
  | { type: 'italic' }
  | { type: 'strike' }
  | { type: 'list' }
  | { type: 'todo' }
  | { type: 'quote' }
  | { type: 'link' }
  | { type: 'code' };

const lineStartOf = (value: string, index: number) => value.lastIndexOf('\n', index - 1) + 1;
const lineEndOf = (value: string, index: number) => {
  const i = value.indexOf('\n', index);
  return i === -1 ? value.length : i;
};

/** 커서가 있는 줄의 제목 단계 (1~6), 제목이 아니면 0 */
export function headingLevelAt(value: string, index: number): number {
  const start = lineStartOf(value, index);
  const match = /^(#{1,6}) /.exec(value.slice(start, lineEndOf(value, start)));
  return match ? match[1].length : 0;
}

function setHeading({ value, start, end }: EditorState, level: number): EditorState {
  const ls = lineStartOf(value, start);
  const le = lineEndOf(value, ls);
  const line = value.slice(ls, le);
  const current = /^(#{1,6}) /.exec(line);
  const stripped = current ? line.slice(current[0].length) : line;
  // 같은 단계를 한 번 더 누르면 제목을 없앱니다.
  const prefix = current && current[1].length === level ? '' : `${'#'.repeat(level)} `;
  const nextLine = prefix + stripped;
  const delta = nextLine.length - line.length;
  return {
    value: value.slice(0, ls) + nextLine + value.slice(le),
    start: Math.max(ls, start + delta),
    end: Math.max(ls, end + delta),
  };
}

function wrap(
  { value, start, end }: EditorState,
  marker: string,
  placeholder: string,
): EditorState {
  const selected = value.slice(start, end);
  const before = value.slice(start - marker.length, start);
  const after = value.slice(end, end + marker.length);
  // 이미 감싸져 있으면 풉니다.
  if (selected && before === marker && after === marker) {
    return {
      value: value.slice(0, start - marker.length) + selected + value.slice(end + marker.length),
      start: start - marker.length,
      end: end - marker.length,
    };
  }
  const text = selected || placeholder;
  return {
    value: value.slice(0, start) + marker + text + marker + value.slice(end),
    start: start + marker.length,
    end: start + marker.length + text.length,
  };
}

function prefixLines({ value, start, end }: EditorState, prefix: string): EditorState {
  const ls = lineStartOf(value, start);
  const le = lineEndOf(value, end);
  const lines = value.slice(ls, le).split('\n');
  const allPrefixed = lines.every((l) => l.startsWith(prefix));
  const next = lines.map((l) => (allPrefixed ? l.slice(prefix.length) : prefix + l)).join('\n');
  const firstDelta = allPrefixed ? -prefix.length : prefix.length;
  return {
    value: value.slice(0, ls) + next + value.slice(le),
    start: Math.max(ls, start + firstDelta),
    end: end + (next.length - (le - ls)),
  };
}

function insertLink(state: EditorState): EditorState {
  const { value, start, end } = state;
  const label = value.slice(start, end) || '링크 텍스트';
  const url = 'https://';
  const snippet = `[${label}](${url})`;
  const urlStart = start + snippet.length - url.length - 1;
  return {
    value: value.slice(0, start) + snippet + value.slice(end),
    start: urlStart,
    end: urlStart + url.length,
  };
}

function insertCode(state: EditorState): EditorState {
  const { value, start, end } = state;
  const selected = value.slice(start, end);
  if (selected && !selected.includes('\n')) return wrap(state, '`', 'code');
  const atLineStart = start === lineStartOf(value, start);
  const lead = atLineStart ? '' : '\n';
  const block = `${lead}\`\`\`\n${selected}\n\`\`\`\n`;
  const caret = start + lead.length + '```\n'.length;
  return {
    value: value.slice(0, start) + block + value.slice(end),
    start: caret,
    end: caret + selected.length,
  };
}

export function applyFormat(state: EditorState, command: FormatCommand): EditorState {
  switch (command.type) {
    case 'heading':
      return setHeading(state, command.level);
    case 'bold':
      return wrap(state, '**', '굵은 텍스트');
    case 'italic':
      return wrap(state, '_', '기울인 텍스트');
    case 'strike':
      return wrap(state, '~~', '취소선 텍스트');
    case 'list':
      return prefixLines(state, '- ');
    case 'todo':
      return prefixLines(state, '- [ ] ');
    case 'quote':
      return prefixLines(state, '> ');
    case 'link':
      return insertLink(state);
    case 'code':
      return insertCode(state);
  }
}
