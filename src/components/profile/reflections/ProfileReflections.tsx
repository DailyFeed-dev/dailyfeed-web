import ProfileLearningCalendar from './components/ProfileLearningCalendar';
import ProfileReflectionList from './components/ProfileReflectionList';
import { useProfileReflections } from './hooks/useProfileReflections';
import ProfileRecordDetail from '../shared/components/ProfileRecordDetail';
import ProfileResourceState from '../shared/components/ProfileResourceState';
import ProfileSectionHeading from '../shared/components/ProfileSectionHeading';
import ProfileStatCard from '../shared/components/ProfileStatCard';
import ProfilePagination from '../shared/components/ProfilePagination';

// 학습 회고 탭에서 내 TIL 통계·달력·목록을 조합한다.

export default function ProfileReflections() {
  const {
    data,
    isLoading,
    error,
    retry,
    month,
    records,
    monthCount,
    selected,
    setSelected,
    showAll,
    toggleShowAll,
    page,
    setPage,
  } = useProfileReflections();

  return (
    <section className="mt-8" aria-labelledby="profile-reflections-title">
      <ProfileSectionHeading
        id="profile-reflections-title"
        title="학습 회고"
        description="TIL 게시판에 작성한 나의 학습 기록을 확인하세요."
      />
      {!data ? (
        <ProfileResourceState isLoading={isLoading} error={error} onRetry={retry} />
      ) : selected ? (
        <ProfileRecordDetail
          record={selected}
          category="TIL"
          body={selected.body ?? ''}
          onBack={() => setSelected(null)}
        />
      ) : (
        <>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <ProfileStatCard
              kind="reflections"
              label="누적 TIL"
              value={data.tilStats.totalTilCount ?? 0}
              description="나의 학습 기록"
            />
            <ProfileStatCard
              kind="posts"
              label="이번 달 TIL"
              value={monthCount}
              description={month.replace('-', '년 ') + '월'}
            />
            <ProfileStatCard
              kind="projects"
              label="연속 작성일"
              value={data.tilStats.consecutiveWritingDays ?? 0}
              description="연속 학습 일수"
            />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <ProfileLearningCalendar stats={data.tilStats} month={month} />
            <div className="rounded-2xl bg-white">
              <ProfileReflectionList
                records={records}
                showAll={showAll}
                hasMore={data.tilPage.hasNext ?? false}
                onSelect={setSelected}
                onToggleShowAll={toggleShowAll}
              />
              {showAll && (
                <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                  <ProfilePagination
                    label="TIL 페이지"
                    page={page}
                    size={data.tilPage.size ?? 10}
                    itemCount={records.length}
                    hasNext={data.tilPage.hasNext ?? false}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
