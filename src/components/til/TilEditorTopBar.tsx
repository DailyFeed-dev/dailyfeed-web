import Link from 'next/link';

import Button from '@/components/common/Button';

import { TilIcon, type TilIconName } from './TilTempUi';
import { TIL_BOARD_BASE } from './tilBoardUrl';

export type TilEditorMode = 'text' | 'markdown';

const MODES: { value: TilEditorMode; label: string; icon: TilIconName }[] = [
  { value: 'text', label: '텍스트', icon: 'mode-text' },
  { value: 'markdown', label: '마크다운', icon: 'mode-markdown' },
];

type Props = {
  mode: TilEditorMode;
  onModeChange: (mode: TilEditorMode) => void;
  backHref?: string;
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
};

/** 작성 화면 상단 바 — 텍스트 / 마크다운 모드 전환 (디자인: Editor Top Bar 74:8204) */
export default function TilEditorTopBar({
  mode,
  onModeChange,
  backHref = TIL_BOARD_BASE,
  onSubmit,
  submitLabel,
  submitting = false,
}: Props) {
  return (
    <header className="grid h-18 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-[#f0eff5] bg-white px-4 sm:px-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 justify-self-start text-[15px] leading-[1.4] font-medium text-[#6b6a7b] hover:text-[#1f1d2b]"
      >
        <TilIcon name="chevron-left" size={20} strokeWidth={1.6} />
        <span className="hidden sm:inline">TIL 게시판</span>
      </Link>

      <div
        role="radiogroup"
        aria-label="작성 모드"
        className="flex gap-1 rounded-xl border border-[#f0eff5] bg-[#f6f5fb] p-1"
      >
        {MODES.map((m) => {
          const active = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onModeChange(m.value)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-[9px] px-3 py-2 text-sm leading-[1.4] transition-colors sm:px-4 ${
                active
                  ? 'bg-white font-semibold text-[#4b3fd6] shadow-[0_2px_6px_rgba(31,28,43,0.08)]'
                  : 'font-medium text-[#6b6a7b] hover:bg-white/60'
              }`}
            >
              <TilIcon name={m.icon} className={active ? 'text-[#685cf0]' : 'text-[#9a99a8]'} />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button size="md" onClick={onSubmit} disabled={submitting}>
          {submitLabel}
        </Button>
      </div>
    </header>
  );
}
