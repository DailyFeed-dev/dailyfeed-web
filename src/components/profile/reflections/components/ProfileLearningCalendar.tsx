import { useState } from 'react';

import type { ProfileTilStats } from '../../profileActivity';

type Props = { stats: ProfileTilStats; month: string };
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export default function ProfileLearningCalendar({ stats, month }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [year, monthNumber] = month.split('-').map(Number);
  const offset = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const counts = new Map(stats.last13WeeksDailyWriteCounts.map((day) => [day.date, day.count]));

  return (
    <section className="rounded-2xl bg-white p-6 sm:p-7" aria-labelledby="profile-calendar-title">
      <div className="flex items-center justify-between gap-3">
        <h3 id="profile-calendar-title" className="font-semibold">
          {monthNumber}월 학습 기록
        </h3>
        <p className="text-xs text-(--color-text-muted)">{year}</p>
      </div>
      <p className="mt-2 text-xs text-(--color-text-muted)">
        TIL 작성 수 기준 · 총 {stats.totalTilCount}개
      </p>
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs">
        {weekdays.map((day) => (
          <span key={day} className="pb-1 text-(--color-text-muted)">
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden="true" />
        ))}
        {Array.from({ length: days }, (_, index) => {
          const day = index + 1;
          const date = `${month}-${String(day).padStart(2, '0')}`;
          const count = counts.get(date) ?? 0;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelected(date)}
              aria-pressed={selected === date}
              aria-label={`${date}, TIL ${count}개`}
              className={`aspect-square rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 ${selected === date ? 'bg-(--color-bg-brand) text-white' : count > 0 ? 'bg-(--color-bg-brand-muted) text-(--color-text-brand)' : 'bg-(--color-bg-subtle) text-(--color-text-muted)'}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p role="status" className="mt-5 min-h-5 text-xs leading-5 text-(--color-text-muted)">
        {selected
          ? `${selected}: TIL ${counts.get(selected) ?? 0}개 작성`
          : '날짜를 누르면 해당 날짜의 TIL 작성 수가 보입니다.'}
      </p>
      <p className="mt-2 text-xs text-(--color-text-muted)">
        연속 {stats.consecutiveWritingDays}일 · 이번 주 {stats.thisWeekWriteCount}개
      </p>
    </section>
  );
}
