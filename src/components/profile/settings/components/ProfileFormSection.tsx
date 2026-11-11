import type { ReactNode } from 'react';

import Button from '@/components/common/Button';

type ProfileFormSectionProps = {
  title: string;
  isPending: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  pendingLabel: string;
  children: ReactNode;
  secondaryAction?: ReactNode;
};
// 설정 영역의 제목·입력 내용·저장 버튼을 묶는 공통 틀이다. 전달받은 상태에 따라 화면을 표시하고, 실제 입력 검사와 저장은 다른 함수가 담당

export default function ProfileFormSection({
  title,
  isPending,
  isSubmitting,
  submitLabel,
  pendingLabel,
  children,
  secondaryAction,
}: ProfileFormSectionProps) {
  return (
    <fieldset disabled={isPending} className="min-w-0 space-y-5">
      <legend className="sr-only">{title}</legend>
      {children}
      <div className="flex flex-wrap justify-end gap-3">
        {secondaryAction}
        <Button type="submit" style={{ borderRadius: 10 }}>
          {isSubmitting ? pendingLabel : submitLabel}
        </Button>
      </div>
    </fieldset>
  );
}
