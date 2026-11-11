import type { ComponentProps } from 'react';

type InputProps = ComponentProps<'input'> & {
  id: string;
  label?: string;
  helper?: string;
  error?: string;
};

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
