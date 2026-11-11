import type { ComponentProps } from 'react';

type InputProps = ComponentProps<'input'> & {
  /** label 과 도움말을 입력칸에 연결하는 데 쓰므로 꼭 넘깁니다. (useId 로 만들기) */
  id: string;
  /** 위에 보이는 라벨. 생략하면 aria-label 을 넘겨 주세요. */
  label?: string;
  /** 아래에 보이는 도움말 */
  helper?: string;
  /** 에러 문구. 있으면 빨간 테두리가 되고 도움말 대신 보입니다. */
  error?: string;
};

/**
 * 공용 입력칸입니다. (Figma: 04 · 컴포넌트 · Input, 라벨 + 입력칸 + 도움말)
 * 포커스는 보라 테두리, 에러는 빨간 테두리와 문구로 구분합니다.
 * className 은 바깥 틀(너비·여백)에 붙고, 나머지 속성은 input 에 그대로 전달됩니다.
 *
 * @example <Input id={id} label="제목" helper="30자 이내" value={title} onChange={...} />
 */
export default function Input({
  id,
  label,
  helper,
  error,
  className,
  'aria-describedby': describedBy,
  ...props
}: InputProps) {
  const message = error ?? helper;
  const messageId = `${id}-message`;

  return (
    <div
      className={`flex flex-col gap-1.5 ${props.disabled ? 'opacity-60' : ''} ${className ?? ''}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] leading-normal font-medium text-(--color-text-primary)"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [describedBy, message && messageId].filter(Boolean).join(' ') || undefined
        }
        className={`w-full rounded-[10px] px-3.5 py-3 text-sm leading-[1.55] text-(--color-text-primary) outline-none ring-inset placeholder:text-(--color-text-muted) disabled:cursor-not-allowed disabled:text-(--color-text-disabled) disabled:placeholder:text-(--color-text-disabled) ${
          error
            ? 'bg-(--color-bg-surface) ring-[1.5px] ring-(--color-border-danger)'
            : 'bg-(--color-bg-subtle) focus:bg-(--color-bg-surface) focus:ring-[1.5px] focus:ring-(--color-border-brand)'
        }`}
      />
      {message && (
        <p
          id={messageId}
          className={`text-xs leading-normal ${error ? 'text-(--color-text-danger)' : 'text-(--color-text-muted)'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
