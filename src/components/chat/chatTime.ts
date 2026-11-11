const timeFormat = new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit' });
const monthDayFormat = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' });
const yearDayFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const dividerFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function toDayKey(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function formatMessageTime(iso: string) {
  return timeFormat.format(new Date(iso));
}

export function formatDayDivider(iso: string) {
  return dividerFormat.format(new Date(iso));
}

export function formatRelativeTime(iso: string, now = new Date()) {
  const minutes = Math.floor((now.getTime() - Date.parse(iso)) / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}시간 전`;
  return formatRoomTime(iso, now);
}

export function formatRoomTime(iso: string, now = new Date()) {
  const date = new Date(iso);
  if (isSameDay(date, now)) return timeFormat.format(date);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return '어제';
  if (date.getFullYear() === now.getFullYear()) return monthDayFormat.format(date);
  return yearDayFormat.format(date);
}
