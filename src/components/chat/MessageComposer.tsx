'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';

import Icon from '@/components/common/Icon';

type MessageComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function MessageComposer({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요',
}: MessageComposerProps) {
  const [text, setText] = useState('');
  const canSend = !disabled && text.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    onSend(text);
    setText('');
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

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-(--color-border-default) bg-(--color-bg-surface) px-4 py-4 sm:px-5"
    >
      <div className="flex items-center gap-3 rounded-[14px] bg-(--color-bg-subtle) py-2 pr-2 pl-4">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
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
