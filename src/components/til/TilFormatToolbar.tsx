import { Fragment } from 'react';

import { TilIcon, type TilIconName } from './TilTempUi';
import type { FormatCommand } from './tilMarkdownCommands';

type Item = {
  label: string;
  command: FormatCommand;
  icon?: TilIconName;
  text?: string;
  shortcut?: string;
};

const GROUPS: Item[][] = [
  [
    { label: '제목 1', command: { type: 'heading', level: 1 }, text: 'H1' },
    { label: '제목 2', command: { type: 'heading', level: 2 }, text: 'H2' },
    { label: '제목 3', command: { type: 'heading', level: 3 }, text: 'H3' },
    { label: '제목 4', command: { type: 'heading', level: 4 }, text: 'H4' },
  ],
  [
    { label: '굵게', command: { type: 'bold' }, icon: 'bold', shortcut: '⌘B' },
    { label: '기울임', command: { type: 'italic' }, icon: 'italic', shortcut: '⌘I' },
    { label: '취소선', command: { type: 'strike' }, icon: 'strike' },
  ],
  [
    { label: '글머리 기호 목록', command: { type: 'list' }, icon: 'list' },
    { label: '할 일 목록', command: { type: 'todo' }, icon: 'todo' },
    { label: '인용', command: { type: 'quote' }, icon: 'quote' },
  ],
  [
    { label: '링크', command: { type: 'link' }, icon: 'link', shortcut: '⌘K' },
    { label: '코드', command: { type: 'code' }, icon: 'code' },
  ],
];

type Props = {
  /** 커서가 있는 줄의 제목 단계 (0 = 제목 아님) */
  activeHeading: number;
  onCommand: (command: FormatCommand) => void;
};

/** 마크다운 서식 툴바 (디자인: Format Toolbar 75:8185) */
export default function TilFormatToolbar({ activeHeading, onCommand }: Props) {
  return (
    <div
      role="toolbar"
      aria-label="서식"
      className="flex w-fit max-w-full flex-wrap items-center gap-0.5 self-start rounded-[10px] bg-[#f6f5fb] p-1.5"
    >
      {GROUPS.map((group, gi) => (
        <Fragment key={gi}>
          {gi > 0 && <span aria-hidden="true" className="h-4.5 w-px bg-[#e2defd]" />}
          {group.map((item) => {
            const isHeading = item.command.type === 'heading';
            const active =
              isHeading && 'level' in item.command && item.command.level === activeHeading;
            return (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                aria-pressed={isHeading ? active : undefined}
                title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
                // textarea 의 포커스 · 선택 영역을 유지합니다.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onCommand(item.command)}
                className={`inline-flex size-8.5 cursor-pointer items-center justify-center rounded-md text-[#6b6a7b] transition-colors ${
                  active ? 'bg-white text-[#4b3fd6]' : 'hover:bg-white/70'
                }`}
              >
                {item.icon ? (
                  <TilIcon name={item.icon} />
                ) : (
                  <span className="text-sm leading-[1.4] font-bold">{item.text}</span>
                )}
              </button>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
