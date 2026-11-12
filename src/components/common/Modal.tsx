import Button from './Button';

type ModalProps = {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  onConfirm: () => void;
  /** 확인 버튼 색. 삭제·로그아웃처럼 되돌리기 어려운 작업은 danger */
  confirmVariant?: 'primary' | 'danger';
  /** 값을 주면 확인 버튼 왼쪽에 취소 버튼이 보입니다. */
  cancelLabel?: string;
  onCancel?: () => void;
};

/**
 * 확인 모달입니다. 바깥 영역을 눌러도 닫히지 않고, 버튼으로만 닫습니다.
 * 열고 닫는 상태(open)는 사용하는 쪽에서 관리합니다.
 */
export default function Modal({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  confirmVariant = 'danger',
  cancelLabel,
  onCancel,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={body ? 'modal-body' : undefined}
        className="flex w-full max-w-100 flex-col gap-6 rounded-xl border border-(--color-border-default) bg-(--color-bg-surface) p-6 shadow-[0_2px_3px_rgba(31,28,43,0.06),0_16px_20px_rgba(31,28,43,0.14)]"
      >
        <div className="flex flex-col gap-3">
          <h2
            id="modal-title"
            className="min-h-8 text-lg leading-[1.4] font-semibold text-(--color-text-primary)"
          >
            {title}
          </h2>
          {body && (
            <p
              id="modal-body"
              className="text-sm leading-[1.55] whitespace-pre-line text-(--color-text-secondary)"
            >
              {body}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          {cancelLabel && (
            <Button variant="outline" size="md" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button variant={confirmVariant} size="md" autoFocus onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
