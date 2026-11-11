import type { ComponentProps } from 'react';

type AuthInputProps = ComponentProps<'input'> & {
  /** label 과 에러 문구를 input 에 연결하는 데 쓰므로 꼭 넘깁니다. (useId 로 만들기) */
  id: string;
  label: string;
  error?: string;
};

/**
 * Auth 화면 전용 입력칸입니다. (Figma: Auth Components · TextField)
 * 팀 공용 Input 이 생기면 import 만 바꿀 수 있도록 input 기본 속성 + label, error 만 받습니다.
 */
export default function AuthInput({
  id,
  label,
  error,
  className,
  'aria-describedby': describedBy,
  ...props
}: AuthInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="group flex flex-col gap-3.5">
      <label
        htmlFor={id}
        className="text-sm leading-[17px] font-medium text-[#29273a] group-has-disabled:text-[#a5a3b2]"
      >
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[describedBy, error && errorId].filter(Boolean).join(' ') || undefined}
        className={`h-14 w-full rounded-[10px] border bg-white px-4 text-[15px] outline-none placeholder:text-[#a5a3b2] disabled:cursor-not-allowed disabled:bg-[#e5e2f1] ${
          error
            ? 'border-(--auth-danger)'
            : 'border-(--auth-border-strong) focus:border-(--auth-primary)'
        } ${className ?? ''}`}
      />
      {error && (
        <p id={errorId} className="text-[13px] text-(--auth-danger)">
          {error}
        </p>
      )}
    </div>
  );
}
