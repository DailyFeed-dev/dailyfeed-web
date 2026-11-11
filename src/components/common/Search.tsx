import type { ComponentProps } from 'react';

import Icon from './Icon';

type SearchProps = Omit<ComponentProps<'input'>, 'type'>;

/**
 * 공용 검색칸입니다. (Figma: 04 · 컴포넌트 · Search)
 * 헤더 검색, 채팅방 검색, 자료 검색에 같이 씁니다. 플레이스홀더만 바꿔서 씁니다.
 * className 은 바깥 틀(너비·여백)에 붙고, 나머지 속성은 input 에 그대로 전달됩니다.
 * 화면에 라벨이 없으므로 aria-label 을 생략하면 placeholder 를 이름으로 씁니다.
 *
 * @example <Search placeholder="대화 검색" value={keyword} onChange={...} />
 */
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
