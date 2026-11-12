'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BOARD_CATEGORIES, type BoardCategory } from '../boardCategories';

// 카테고리 드롭다운 — 누르면 목록이 펼쳐지고, 고르면 닫힙니다.
// 선택값은 name 으로 폼에 함께 담깁니다. (등록은 API 연결 후 붙여 주세요)
export default function BoardCategorySelect({
  id,
  name = 'category',
}: {
  id: string;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BoardCategory | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // 바깥을 누르거나 Esc 를 누르면 닫습니다.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedLabel = BOARD_CATEGORIES.find((category) => category.code === selected)?.label;

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={selected ?? ''} />
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[46px] w-full items-center rounded-[10px] bg-[#F3F2F8] py-3 pr-4 pl-3.5 text-left text-sm leading-[1.55]"
      >
        <span className={`flex-1 ${selectedLabel ? 'text-[#1F1D2B]' : 'text-[#6C6980]'}`}>
          {selectedLabel ?? '카테고리를 선택해주세요'}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-6 text-[#201D2B] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-[10px] border border-[#ECEAF4] bg-white py-2 shadow-[0_6px_20px_rgba(41,31,64,0.08)]"
        >
          {BOARD_CATEGORIES.map((category) => (
            <li key={category.code} role="option" aria-selected={category.code === selected}>
              <button
                type="button"
                onClick={() => {
                  setSelected(category.code);
                  setOpen(false);
                }}
                className="w-full px-3.5 py-3 text-left text-sm leading-[1.55] text-[#1F1D2B] hover:bg-[#F3F2F8]"
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
