import Button from '@/components/common/Button';

type Props = {
  page: number;
  size: number;
  itemCount: number;
  hasNext: boolean;
  label: string;
  onPageChange: (page: number) => void;
};

export default function ProfilePagination({
  page,
  size,
  itemCount,
  hasNext,
  label,
  onPageChange,
}: Props) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-(--color-text-muted)">
      <p>
        {itemCount ? `${page * size + 1}~${page * size + itemCount}번째 기록` : '표시할 기록 없음'}
      </p>
      <nav aria-label={label} className="flex flex-wrap items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          이전
        </Button>
        <span aria-current="page" className="px-3">
          {page + 1}페이지
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          다음
        </Button>
      </nav>
    </div>
  );
}
