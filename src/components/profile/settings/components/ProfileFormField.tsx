import { useState } from 'react';

import Input from '@/components/common/Input';

type ProfileFormFieldProps = {
  label: string;
  name: string;
  type: 'text';
  defaultValue?: string;
  maxLength?: number;
  error?: string;
};
// 입력창의 제목, 텍스트 입력칸, 오류 메시지를 하나로 묶어서 재사용하는 컴포넌트, 상태메시지에서만 사용 추후 확장 가능

export default function ProfileFormField({
  label,
  name,
  defaultValue = '',
  maxLength,
  error,
  ...props
}: ProfileFormFieldProps) {
  const [length, setLength] = useState(defaultValue.length);

  return (
    <Input
      {...props}
      id={name}
      name={name}
      label={label}
      defaultValue={defaultValue}
      maxLength={maxLength}
      onChange={(event) => setLength(event.currentTarget.value.length)}
      helper={maxLength ? `${length} / ${maxLength}자` : undefined}
      error={error}
    />
  );
}
