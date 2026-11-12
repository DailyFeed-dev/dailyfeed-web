import Button from '@/components/common/Button';

type Props = { isLoading: boolean; error: string; onRetry: () => void };

export default function ProfileResourceState({ isLoading, error, onRetry }: Props) {
  if (isLoading)
    return (
      <p role="status" className="py-8 text-sm text-(--color-text-muted)">
        정보를 불러오는 중입니다.
      </p>
    );
  return (
    <div className="my-6 rounded-2xl bg-white p-6 text-(--color-text-primary)">
      <p role="alert" className="mb-4 text-sm text-(--color-text-danger)">
        {error || '표시할 정보가 없습니다.'}
      </p>
      <Button variant="outline" onClick={onRetry}>
        다시 불러오기
      </Button>
    </div>
  );
}
