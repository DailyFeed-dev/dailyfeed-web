import type { Schemas } from '@/lib/api';

import TilAvatar from './TilAvatar';
import { TilIcon } from './TilTempUi';
import { formatTilDate } from './tilBoardUrl';

const LEVEL_CLASS = [
  'bg-[#eeedf4]',
  'bg-[#dad5fc]',
  'bg-[#b3aaf7]',
  'bg-[#8a7ff3]',
  'bg-[#5b4fe0]',
];

const widgetClass = 'flex flex-col gap-4 rounded-xl border border-[#e2defd] bg-white p-5';
const titleClass = 'text-base leading-[1.4] font-semibold text-[#1f1d2b]';

/** 하루 작성 수 → 색 단계 (0, 1, 2, 3, 4개 이상) */
const levelOf = (count: number) => Math.min(4, Math.max(0, count));

/** 날짜별 작성 수(오래된 날 → 오늘)를 7일씩 묶어 주(열) 단위로 만듭니다. */
function toWeeks(days: Schemas['DailyWriteCountResponse'][] = []) {
  const weeks: Schemas['DailyWriteCountResponse'][][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

/** 나의 학습 기록 (디자인: Widget/My Streak 67:7424) */
export function TilStreakWidget({ stats }: { stats: Schemas['MyStatsResponse'] }) {
  const streak = stats.consecutiveWritingDays ?? 0;
  const summary: [number, string][] = [
    [stats.totalTilCount ?? 0, '총 TIL'],
    [streak, '연속 기록'],
    [stats.thisWeekWriteCount ?? 0, '이번 주'],
  ];

  return (
    <section aria-labelledby="til-streak-title" className={widgetClass}>
      <div className="flex items-center justify-between">
        <h2 id="til-streak-title" className={titleClass}>
          나의 학습 기록
        </h2>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 rounded-[20px] bg-[#fff1e8] px-2.5 py-1 text-xs leading-[1.4] font-semibold text-[#f26b1d]">
            <TilIcon name="flame" />
            {streak}일 연속
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {summary.map(([value, label]) => (
          <div
            key={label}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-[10px] bg-[#f6f5fb] py-3 leading-[1.4]"
          >
            <span className="text-xl font-bold text-[#1f1d2b]">{value}</span>
            <span className="text-xs font-medium text-[#9a99a8]">{label}</span>
          </div>
        ))}
      </div>

      <div role="img" aria-label={`최근 13주 학습 기록, ${streak}일 연속`} className="flex gap-1">
        {toWeeks(stats.last13WeeksDailyWriteCounts).map((week) => (
          <div key={week[0]?.date} className="flex flex-col gap-1">
            {week.map((day) => (
              <span
                key={day.date}
                title={`${formatTilDate(day.date)} · ${day.count ?? 0}개`}
                className={`size-4.5 rounded ${LEVEL_CLASS[levelOf(day.count ?? 0)]}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="flex items-center justify-end gap-1 text-[11px] leading-[1.4] font-medium text-[#9a99a8]"
      >
        <span>Less</span>
        {LEVEL_CLASS.map((cls) => (
          <span key={cls} className={`size-3 rounded-[3px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}

/** 이번 주 TOP 기록자 (디자인: Widget/Top Writers 67:7583) */
export function TilTopWritersWidget({ ranking }: { ranking: Schemas['WeeklyRankingResponse'] }) {
  const items = ranking.items ?? [];
  return (
    <section aria-labelledby="til-top-writers-title" className={widgetClass}>
      <h2 id="til-top-writers-title" className={titleClass}>
        이번 주 TOP 기록자
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-[#9a99a8]">이번 주 기록이 아직 없어요.</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.rank} className="flex items-center gap-3 leading-[1.4]">
              <span
                className={`text-sm font-bold ${item.rank === 1 ? 'text-[#685cf0]' : 'text-[#9a99a8]'}`}
              >
                {item.rank}
              </span>
              <TilAvatar
                name={item.user?.name}
                src={item.user?.avatarUrl}
                size={32}
                color="#1f1d2b"
              />
              <span className="min-w-0 flex-1 text-sm font-semibold text-[#1f1d2b]">
                {item.user?.name}
              </span>
              <span className="text-[13px] font-medium text-[#6b6a7b]">
                {item.writeCount ?? 0}개
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
