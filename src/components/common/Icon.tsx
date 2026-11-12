import type { ComponentProps } from 'react';

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
  | 'chevron-down'
  | 'message'
  | 'warning'
  | 'refresh';

type IconProps = Omit<ComponentProps<'span'>, 'children'> & {
  name: IconName;
  size?: number;
  label?: string;
};

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
