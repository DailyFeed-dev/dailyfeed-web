import { useCallback, useState } from 'react';

import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import { getMyProfilePosts } from '@/services/profileService';

import ProfileRecordDetail from '../shared/components/ProfileRecordDetail';
import ProfileResourceState from '../shared/components/ProfileResourceState';
import ProfileSectionHeading from '../shared/components/ProfileSectionHeading';
import { formatProfileDate, type ProfileRecord, type ProfileView } from '../profileActivity';
import { useProfileResource } from '../shared/hooks/useProfileResource';

type Props = { onViewChange: (view: ProfileView) => void };

export default function ProfilePosts({ onViewChange }: Props) {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<ProfileRecord | null>(null);
  const load = useCallback((signal: AbortSignal) => getMyProfilePosts(page, signal), [page]);
  const { data, isLoading, error, retry } = useProfileResource(`posts-${page}`, load);
  const totalPages = data ? Math.max(1, Math.ceil(data.totalElements / data.size)) : 1;
  const firstPage = Math.min(Math.max(0, page - 1), Math.max(0, totalPages - 4));

  return (
    <section className="mt-8" aria-labelledby="profile-posts-title">
      <ProfileSectionHeading
        id="profile-posts-title"
        title="내가 작성한 게시글"
        description="프로젝트에서 작성한 글만 모아 확인하세요."
        action={
          <Button variant="outline" onClick={() => onViewChange('overview')}>
            프로젝트 둘러보기
          </Button>
        }
      />
      {selected ? (
        <ProfileRecordDetail
          record={selected}
          category="프로젝트 게시글"
          onBack={() => setSelected(null)}
        />
      ) : !data ? (
        <ProfileResourceState isLoading={isLoading} error={error} onRetry={retry} />
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-6 sm:p-7">
          <div className="flex items-center gap-3 border-b border-(--color-border-default) pb-4">
            <h3 className="font-semibold">전체 게시글</h3>
            <Badge>{data.totalElements}</Badge>
            <p className="ml-auto text-xs text-(--color-text-muted)">최신순</p>
          </div>
          {data.items.length === 0 ? (
            <p className="py-12 text-center text-sm text-(--color-text-muted)">
              작성한 게시글이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-(--color-border-default)">
              {data.items.map((post) => (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(post)}
                    className="flex w-full min-w-0 items-center gap-4 py-6 text-left focus-visible:outline-2 focus-visible:outline-(--color-border-brand)"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Badge>
                          {post.projectName || `프로젝트 ${post.projectId ?? '미지정'}`}
                        </Badge>
                        <time
                          dateTime={post.createdAt}
                          className="text-xs text-(--color-text-muted)"
                        >
                          {formatProfileDate(post.createdAt)}
                        </time>
                      </div>
                      <p className="mt-3 font-semibold wrap-anywhere">{post.title}</p>
                      <p className="mt-2 line-clamp-1 text-sm wrap-anywhere text-(--color-text-muted)">
                        {post.body}
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
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-(--color-text-muted)">
            <p>
              전체 {data.totalElements}개 중 {data.items.length ? page * data.size + 1 : 0}~
              {Math.min((page + 1) * data.size, data.totalElements)}개
            </p>
            <nav aria-label="게시글 페이지" className="flex flex-wrap items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                이전
              </Button>
              {Array.from({ length: Math.min(4, totalPages) }, (_, index) => firstPage + index).map(
                (number) => (
                  <Button
                    key={number}
                    variant={number === page ? 'soft' : 'outline'}
                    aria-label={`${number + 1}페이지`}
                    aria-current={number === page ? 'page' : undefined}
                    style={{ paddingInline: 10 }}
                    onClick={() => setPage(number)}
                  >
                    {number + 1}
                  </Button>
                ),
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                다음
              </Button>
            </nav>
          </div>
        </div>
      )}
    </section>
  );
}
