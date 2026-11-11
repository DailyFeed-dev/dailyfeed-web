import type { ComponentProps } from 'react';

/** public/icons 에 있는 아이콘 이름입니다. (Figma: 04 · 컴포넌트 · Icon) */
export type IconName =
  | 'search'
  | 'bell'
  | 'arrow-left'
  | 'filter'
  | 'plus'
  | 'close'
  | 'check'
  | 'send'
  | 'more'
  | 'chevron-down';

type IconProps = Omit<ComponentProps<'span'>, 'children'> & {
  name: IconName;
  /** 픽셀 크기. Figma 기본값은 24 입니다. */
  size?: number;
  /** 아이콘만으로 뜻을 전달할 때 화면 읽기 프로그램용 이름. 없으면 장식으로 숨깁니다. */
  label?: string;
};

/**
 * 공용 아이콘입니다. 색은 글자색(currentColor)을 따라갑니다.
 * Figma 기본 색은 text/secondary 이므로 단독으로 쓸 때는 className="text-(--color-text-secondary)" 를 붙입니다.
 *
 * 새 아이콘 추가: Figma 에서 SVG 로 내보내 public/icons/<이름>.svg 로 넣고 IconName 에 이름을 추가합니다.
 *
 * @example <Icon name="search" size={18} className="text-(--color-text-muted)" />
 */
export default function Icon({ name, size = 24, label, className, style, ...props }: IconProps) {
  const url = `url(/icons/${name}.svg)`;

  return (
    <span
      {...props}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 bg-current ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        maskImage: url,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        ...style,
      }}
    />
  );
}
