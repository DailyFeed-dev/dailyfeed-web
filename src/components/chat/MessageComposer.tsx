'use client';

import { useRef, type ChangeEvent, type FormEvent, type KeyboardEvent, type Ref } from 'react';

import Icon from '@/components/common/Icon';

type MessageComposerProps = {
  value: string;
  onValueChange: (text: string) => void;
  onSend: (text: string) => void;
  onAttach?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
  inputRef?: Ref<HTMLTextAreaElement>;
};

export default function MessageComposer({
  value,
  onValueChange,
  onSend,
  onAttach,
  disabled = false,
  placeholder = '메시지를 입력하세요',
  inputRef,
}: MessageComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSend = !disabled && value.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    onSend(value);
    onValueChange('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    submit();
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    for (const file of files) onAttach?.(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-(--color-border-default) bg-(--color-bg-surface) px-4 py-4 sm:px-5"
    >
      <div className="flex items-center gap-3 rounded-[14px] bg-(--color-bg-subtle) py-2 pr-2 pl-4">
        {onAttach && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              aria-label="파일 첨부"
              className="-ml-1.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--color-text-secondary) hover:bg-(--color-bg-surface) disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="paperclip" size={22} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              tabIndex={-1}
              onChange={handleFiles}
            />
          </>
        )}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={placeholder}
          aria-label="메시지 입력"
          className="field-sizing-content max-h-32 min-w-0 flex-1 resize-none bg-transparent py-2 text-sm leading-[1.45] text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="보내기"
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--color-bg-brand) text-(--color-text-on-brand) disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="send" size={20} />
        </button>
      </div>
    </form>
  );
}
