import Link from 'next/link';

import { buttonClassName } from '@/components/common/Button';

import ProfilePostList from './components/ProfilePostList';
import { useProfilePosts } from './hooks/useProfilePosts';
import ProfileRecordDetail from '../shared/components/ProfileRecordDetail';
import ProfileResourceState from '../shared/components/ProfileResourceState';
import ProfileSectionHeading from '../shared/components/ProfileSectionHeading';
import ProfilePagination from '../shared/components/ProfilePagination';
import { getProfilePostBody } from '../profileActivity';

export default function ProfilePosts() {
  const { page, setPage, selected, setSelected, data, isLoading, error, retry } = useProfilePosts();
  return (
    <section className="mt-8" aria-labelledby="profile-posts-title">
      <ProfileSectionHeading
        id="profile-posts-title"
        title="내가 작성한 게시글"
        description="게시판에 작성한 나의 글을 모아 확인하세요."
        action={
          <Link href="/board" className={buttonClassName({ variant: 'outline' })}>
            게시판 바로가기
          </Link>
        }
      />
      {selected ? (
        <ProfileRecordDetail
          record={selected}
          category="게시판"
          body={getProfilePostBody(selected)}
          onBack={() => setSelected(null)}
        />
      ) : !data ? (
        <ProfileResourceState isLoading={isLoading} error={error} onRetry={retry} />
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-6 sm:p-7">
          <ProfilePostList posts={data} onSelect={setSelected} />
          <ProfilePagination
            label="게시글 페이지"
            page={page}
            size={data.size ?? 3}
            hasNext={data.hasNext ?? false}
            itemCount={data.items?.length ?? 0}
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
}
