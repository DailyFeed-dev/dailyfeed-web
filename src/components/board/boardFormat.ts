// 게시판 화면용 날짜 표시. ISO 문자열을 '2026.11.10' / '2026.11.10 09:30' 으로 바꿉니다.
const pad = (value: number) => String(value).padStart(2, '0');

export function formatDate(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

export function formatDateTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${formatDate(iso)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// "방금 전", "3시간 전", "어제", "2일 전" … 일주일이 넘으면 날짜로 보여 줍니다.
export function formatRelativeTime(iso?: string, now = Date.now()): string {
  if (!iso) return '';
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (Number.isNaN(minutes)) return '';
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  return formatDate(iso);
}
