import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import type { Schemas } from '@/lib/api';

import { formatProfileDate } from '../../profileActivity';

type Props = {
  record: Schemas['PostResponse'] | Schemas['ReflectionResponse'];
  category: string;
  onBack: () => void;
};

// posts에서 글을 눌렀을 대 보여주는 상세 화면 UI

export default function ProfileRecordDetail({ record, category, onBack }: Props) {
  return (
    <article className="mt-6 rounded-2xl bg-white p-6 sm:p-7">
      <Button variant="outline" icon="arrow-left" onClick={onBack}>
        목록으로
      </Button>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge>{category}</Badge>
        <time dateTime={record.createdAt} className="text-xs text-(--color-text-muted)">
          {formatProfileDate(record.createdAt)}
        </time>
      </div>
      <h3 className="mt-4 text-xl font-bold wrap-anywhere text-(--color-text-primary)">
        {record.title}
      </h3>
      <p className="mt-6 text-sm leading-7 wrap-anywhere whitespace-pre-wrap text-(--color-text-secondary)">
        {record.body || '등록된 본문이 없습니다.'}
      </p>
    </article>
  );
}
