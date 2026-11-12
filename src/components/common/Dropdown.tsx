'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { focusFirstInvalid } from '@/lib/focus-first-invalid';

export type DropdownOption = { value: string; label: string };

type DropdownProps = {
  /** 바깥 <label htmlFor> 와 연결하는 id */
  id: string;
  /** 폼에 함께 담길 이름 (선택값이 숨은 입력으로 들어갑니다) */
  name?: string;
  options: readonly DropdownOption[];
  /** 선택된 값. 아직 고르지 않았으면 null */
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 칸 아래에 보이는 도움말 */
  helper?: string;
  /** 있으면 에러 상태가 되어 빨간 테두리와 이 문구가 보입니다. */
  errorMessage?: string;
  disabled?: boolean;
  /** true 면 제출할 때 값이 비어 있으면 에러 상태가 됩니다. (<form> 안에서 쓸 때) */
  required?: boolean;
  /** 필수인데 비어 있을 때 보여 줄 문구 */
  requiredMessage?: string;
};

// 공용 드롭다운 — 눌러서 목록을 펼치고, 고르면 닫힙니다. (기본 / 포커스 / 선택 / 비활성 / 에러 / 열림)
// 화면에 보이는 것만 담당하고, 선택값은 부모가 들고 있습니다.
export default function Dropdown({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = '옵션을 선택하세요',
  helper,
  errorMessage,
  disabled = false,
  required = false,
  requiredMessage = '필수 항목이에요.',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  // 제출했는데 필수 값이 비어 있으면 true. 값을 고르면 풀립니다.
  const [missing, setMissing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isError = Boolean(errorMessage) || missing;
  const message = errorMessage ?? (missing ? requiredMessage : helper);
  const messageId = `${id}-message`;

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

  const selectedLabel = options.find((option) => option.value === value)?.label;

  // 열림·선택·포커스는 흰 배경에 보라 테두리, 처음 상태는 회색 배경입니다.
  const isActive = open || selectedLabel !== undefined;
  // 에러여도 사용자가 직접 눌러 열면 보라색이 우선입니다. (코드가 포커스만 옮긴 경우에는 빨간색 유지)
  const fieldStyle = isError
    ? `bg-white ${open ? 'border-[#6157E9]' : 'border-[#D41717]'}`
    : `${isActive ? 'border-[#6157E9] bg-white' : 'border-transparent bg-[#F3F2F8]'} focus-visible:border-[#6157E9] focus-visible:bg-white`;

  return (
    <div className={`flex flex-col gap-1.5 ${disabled ? 'opacity-60' : ''}`}>
      <div ref={rootRef} className="relative">
        {/* 폼에 값을 담고, required 일 때는 제출할 때 비어 있는지 브라우저가 검사하게 하는 숨은 입력 */}
        {name && (
          <input
            name={name}
            value={value ?? ''}
            onChange={() => {}}
            required={required}
            tabIndex={-1}
            aria-hidden="true"
            onInvalid={(event) => {
              event.preventDefault(); // 브라우저 기본 말풍선 대신 아래 에러 표시를 씁니다.
              setMissing(true);
              // 맨 위 빈 칸이면 이 버튼으로 포커스를 주고 화면을 옮깁니다.
              if (buttonRef.current) focusFirstInvalid(event.currentTarget, buttonRef.current);
            }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-0 opacity-0"
          />
        )}
        <button
          ref={buttonRef}
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-describedby={message ? messageId : undefined}
          onClick={() => setOpen((prev) => !prev)}
          className={`flex h-[46px] w-full items-center gap-2 rounded-[10px] border-[1.5px] px-3.5 text-left text-sm leading-[1.55] outline-none ${fieldStyle}`}
        >
          <span
            className={`min-w-0 flex-1 truncate ${
              disabled ? 'text-[#A9A8B6]' : selectedLabel ? 'text-[#1F1D2B]' : 'text-[#6C6980]'
            }`}
          >
            {selectedLabel ?? placeholder}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`shrink-0 text-[#201D2B] ${open ? 'size-6 rotate-180' : 'size-5'}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            aria-labelledby={id}
            className="absolute top-full right-0 left-0 z-10 mt-2 flex flex-col overflow-hidden rounded-[10px] border border-[#ECEAF4] bg-white p-1.5"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setMissing(false);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm leading-[1.55] ${
                      isSelected
                        ? 'bg-[#F0EEFE] text-[#4B3FD6]'
                        : 'text-[#1F1D2B] hover:bg-[#F0EEFE] hover:text-[#4B3FD6]'
                    }`}
                  >
                    <span className="flex-1">{option.label}</span>
                    {isSelected && <Check aria-hidden="true" className="size-5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {message && (
        <p
          id={messageId}
          className={`text-xs leading-normal ${isError ? 'text-[#D41717]' : 'text-[#6C6980]'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
