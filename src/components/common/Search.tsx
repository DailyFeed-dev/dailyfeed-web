import type { ComponentProps } from 'react';

import Icon from './Icon';

type SearchProps = Omit<ComponentProps<'input'>, 'type'>;

export default function Search({
  placeholder = '검색',
  className,
  'aria-label': ariaLabel,
  ...props
}: SearchProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-[10px] bg-(--color-bg-subtle) px-3.5 py-2.5 ring-inset focus-within:bg-(--color-bg-surface) focus-within:ring-[1.5px] focus-within:ring-(--color-border-brand) ${className ?? ''}`}
    >
      <Icon name="search" size={18} className="text-(--color-text-muted)" />
      <input
        {...props}
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm leading-[1.55] text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) [&::-webkit-search-cancel-button]:appearance-none"
      />
    </div>
  );
}
