import Badge from '@/components/common/Badge';
import Icon from '@/components/common/Icon';
import type { Schemas } from '@/lib/api';

import { formatProfileDate, getProfilePostBody } from '../../profileActivity';

type Props = {
  posts: Schemas['PostPageResponse'];
  onSelect: (post: Schemas['PostResponse']) => void;
};

export default function ProfilePostList({ posts, onSelect }: Props) {
  const items = posts.items ?? [];
  return (
    <>
      <div className="flex items-center gap-3 border-b border-(--color-border-default) pb-4">
        <h3 className="font-semibold">내 게시판 글</h3>
        <p className="ml-auto text-xs text-(--color-text-muted)">최신순</p>
      </div>
      {items.length === 0 ? (
        <p className="py-12 text-center text-sm text-(--color-text-muted)">
          작성한 게시글이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-(--color-border-default)">
          {items.map((post) => (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => onSelect(post)}
                className="flex w-full min-w-0 items-center gap-4 py-6 text-left focus-visible:outline-2 focus-visible:outline-(--color-border-brand)"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Badge>게시판</Badge>
                    <time dateTime={post.createdAt} className="text-xs text-(--color-text-muted)">
                      {formatProfileDate(post.createdAt)}
                    </time>
                  </div>
                  <p className="mt-3 font-semibold wrap-anywhere">
                    {post.title || '제목 없는 게시글'}
                  </p>
                  <p className="mt-2 line-clamp-1 text-sm wrap-anywhere text-(--color-text-muted)">
                    {getProfilePostBody(post)}
                  </p>
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
    </>
  );
}
