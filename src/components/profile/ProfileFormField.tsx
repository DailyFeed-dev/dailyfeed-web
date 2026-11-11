import ProfileErrorMessage from './ProfileErrorMessage';
type ProfileFormFieldProps = {
  label: string;
  name: string;
  type: 'text';
  defaultValue?: string;
  maxLength?: number;
  error?: string;
};

// 입력창의 제목, 텍스트 입력칸, 오류 메시지를 하나로 묶어서 재사용하는 컴포넌트
export default function ProfileFormField({ label, error, ...inputProps }: ProfileFormFieldProps) {
  const errorId = inputProps.name + '-error';

  return (
    <div>
      <label htmlFor={inputProps.name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        {...inputProps}
        id={inputProps.name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900"
      />
      <ProfileErrorMessage id={errorId} error={error} />
    </div>
  );
}
