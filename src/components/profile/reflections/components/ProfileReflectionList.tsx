import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import type { Schemas } from '@/lib/api';

import { formatProfileDate } from '../../profileActivity';

type Props = {
  records: Schemas['TilResponse'][];
  showAll: boolean;
  hasMore: boolean;
  onSelect: (record: Schemas['TilResponse']) => void;
  onToggleShowAll: () => void;
};

export default function ProfileReflectionList({
  records,
  showAll,
  hasMore,
  onSelect,
  onToggleShowAll,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 sm:p-7" aria-labelledby="recent-reflections-title">
      <div className="flex items-center justify-between gap-3">
        <h3 id="recent-reflections-title" className="font-semibold">
          {showAll ? '내 TIL' : '최근 TIL'}
        </h3>
        <Badge>TIL</Badge>
      </div>
      {records.length === 0 ? (
        <p className="py-10 text-sm text-(--color-text-muted)">작성한 TIL이 없습니다.</p>
      ) : (
        <ul className="mt-3 divide-y divide-(--color-border-default)">
          {records.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() => onSelect(record)}
                className="flex w-full min-w-0 items-center gap-3 py-5 text-left focus-visible:outline-2"
              >
                <div className="min-w-0 flex-1">
                  <time dateTime={record.createdAt} className="text-xs text-(--color-text-muted)">
                    {formatProfileDate(record.createdAt)}
                  </time>
                  <p className="mt-2 font-semibold wrap-anywhere">{record.title}</p>
                  <p className="mt-1 text-xs text-(--color-text-muted)">TIL 학습 기록</p>
                </div>
                <Icon
                  name="chevron-down"
                  size={20}
                  className="-rotate-90 text-(--color-text-muted)"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
      {(showAll || hasMore) && (
        <Button variant="outline" className="mt-4" onClick={onToggleShowAll}>
          {showAll ? '최근 TIL만 보기' : '전체 TIL 보기'}
        </Button>
      )}
    </section>
  );
}
