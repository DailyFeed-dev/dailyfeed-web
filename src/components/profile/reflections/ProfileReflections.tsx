import { useState } from 'react';

import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import { getProfileActivity } from '@/services/profileService';

import ProfileLearningCalendar from './components/ProfileLearningCalendar';
import ProfileRecordDetail from '../shared/components/ProfileRecordDetail';
import ProfileResourceState from '../shared/components/ProfileResourceState';
import ProfileSectionHeading from '../shared/components/ProfileSectionHeading';
import ProfileStatCard from '../shared/components/ProfileStatCard';
import {
  formatProfileDate,
  getProfileMonth,
  getProfileProjectName,
  reflectionLabels,
  type ProfileReflection,
} from '../profileActivity';
import { useProfileResource } from '../shared/hooks/useProfileResource';

//학습 회고 탭의 전채 본문을 조합하는 컴포넌트 즉 TIL의 본문

export default function ProfileReflections() {
  const [selected, setSelected] = useState<ProfileReflection | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading, error, retry } = useProfileResource('reflections', getProfileActivity);
  const month = data?.month ?? '2026-11';
  const records = data
    ? [...data.reflections].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];

  return (
    <section className="mt-8" aria-labelledby="profile-reflections-title">
      <ProfileSectionHeading
        id="profile-reflections-title"
        title="학습 회고"
        description="프로젝트에서 배운 점과 경험을 나의 기록으로 남겨요."
      />
      {!data ? (
        <ProfileResourceState isLoading={isLoading} error={error} onRetry={retry} />
      ) : selected ? (
        <ProfileRecordDetail
          record={selected}
          category={reflectionLabels[selected.kind] || '학습 회고'}
          onBack={() => setSelected(null)}
        />
      ) : (
        <>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <ProfileStatCard
              kind="reflections"
              label="누적 학습 회고"
              value={records.length}
              description="나의 성찰 기록"
            />
            <ProfileStatCard
              kind="posts"
              label="이번 달 회고"
              value={records.filter((record) => getProfileMonth(record.createdAt) === month).length}
              description={month.replace('-', '년 ') + '월'}
            />
            <ProfileStatCard
              kind="projects"
              label="참여 프로젝트"
              value={data.projects.length}
              description="기록이 시작되는 공간"
            />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <ProfileLearningCalendar stats={data.tilStats} month={month} />
            <section
              className="rounded-2xl bg-white p-6 sm:p-7"
              aria-labelledby="recent-reflections-title"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 id="recent-reflections-title" className="font-semibold">
                  {showAll ? '전체 회고' : '최근 회고'}
                </h3>
                <Badge>나의 기록</Badge>
              </div>
              {records.length === 0 ? (
                <p className="py-10 text-sm text-(--color-text-muted)">작성한 회고가 없습니다.</p>
              ) : (
                <ul className="mt-3 divide-y divide-(--color-border-default)">
                  {(showAll ? records : records.slice(0, 3)).map((record) => (
                    <li key={record.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(record)}
                        className="flex w-full min-w-0 items-center gap-3 py-5 text-left focus-visible:outline-2"
                      >
                        <div className="min-w-0 flex-1">
                          <time
                            dateTime={record.createdAt}
                            className="text-xs text-(--color-text-muted)"
                          >
                            {formatProfileDate(record.createdAt)}
                          </time>
                          <p className="mt-2 font-semibold wrap-anywhere">{record.title}</p>
                          <p className="mt-1 text-xs text-(--color-text-muted)">
                            {getProfileProjectName(data.projects, record.projectId)} ·{' '}
                            {reflectionLabels[record.kind] || '학습 회고'}
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
              {records.length > 3 && (
                <Button variant="outline" className="mt-4" onClick={() => setShowAll(!showAll)}>
                  {showAll ? '최근 회고만 보기' : `전체 ${records.length}개 보기`}
                </Button>
              )}
            </section>
          </div>
        </>
      )}
    </section>
  );
}
