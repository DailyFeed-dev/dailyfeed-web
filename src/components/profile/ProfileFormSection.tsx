import type { ReactNode } from 'react';

type ProfileFormSectionProps = {
  title: string;
  isPending: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  pendingLabel: string;
  children: ReactNode;
  secondaryAction?: ReactNode;
};

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
    <fieldset disabled={isPending} className="space-y-4">
      <legend className="text-lg font-semibold">{title}</legend>
      {children}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-[#6157E9] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? pendingLabel : submitLabel}
        </button>
        {secondaryAction}
      </div>
    </fieldset>
  );
}
