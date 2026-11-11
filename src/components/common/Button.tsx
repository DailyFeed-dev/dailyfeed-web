import type { ComponentProps } from 'react';

import Icon, { type IconName } from './Icon';

type ButtonVariant = 'primary' | 'soft' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ComponentProps<'button'> & {
  /** primary: 주요 동작(작성, 전송) · soft: 보조 강조 · outline: 취소, 임시저장 */
  variant?: ButtonVariant;
  /** Figma 의 S · M · L 입니다. */
  size?: ButtonSize;
  /** 글자 앞에 붙는 아이콘. 크기는 버튼 크기에 맞춰집니다. */
  icon?: IconName;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-(--color-bg-brand) text-(--color-text-on-brand)',
  soft: 'bg-(--color-bg-brand-soft) text-(--color-text-brand)',
  outline:
    'border border-(--color-border-strong) bg-(--color-bg-surface) text-(--color-text-primary)',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

/** 버튼 아이콘 크기. 링크 버튼에 아이콘을 직접 넣을 때도 이 값을 씁니다. */
export const BUTTON_ICON_SIZE: Record<ButtonSize, number> = { sm: 16, md: 16, lg: 20 };

/**
 * 버튼 모양 클래스만 돌려줍니다. 다른 페이지로 이동하는 링크를 버튼 모양으로 만들 때 씁니다.
 *
 * @example
 * <Link href="/board/new" className={buttonClassName({ variant: 'primary', size: 'md' })}>
 *   <Icon name="plus" size={BUTTON_ICON_SIZE.md} />
 *   글쓰기
 * </Link>
 */
export function buttonClassName({
  variant = 'primary',
  size = 'sm',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return `inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full leading-normal font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ''}`;
}

/**
 * 공용 버튼입니다. (Figma: 04 · 컴포넌트 · Button, 알약형)
 * 모양은 variant · size 로 고르고, className 은 너비·여백 같은 배치에만 씁니다.
 * type 기본값은 "button" 입니다. 폼 제출 버튼은 type="submit" 을 넘깁니다.
 * 페이지 이동은 <Link> 에 buttonClassName() 을 붙여 만듭니다.
 *
 * @example <Button variant="soft" size="md" icon="plus" onClick={...}>새 글</Button>
 */
export default function Button({
  variant = 'primary',
  size = 'sm',
  icon,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button {...props} type={type} className={buttonClassName({ variant, size, className })}>
      {icon && <Icon name={icon} size={BUTTON_ICON_SIZE[size]} />}
      {children}
    </button>
  );
}
