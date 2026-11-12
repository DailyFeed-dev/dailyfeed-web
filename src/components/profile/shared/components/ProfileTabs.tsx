import type { ProfileView } from '../../profileActivity';

// Overview·내 정보·Posts·학습 회고·계정 설정을 선택하는 탭 메뉴

type Props = { view: ProfileView; onChange: (view: ProfileView) => void };
const tabs: { value: ProfileView; label: string }[] = [
  { value: 'overview', label: '종합' },
  { value: 'information', label: '내 정보' },
  { value: 'posts', label: '게시판' },
  { value: 'reflections', label: '학습 회고' },
  { value: 'settings', label: '계정 설정' },
];

export default function ProfileTabs({ view, onChange }: Props) {
  return (
    <nav
      aria-label="프로필 화면"
      className="mt-4 flex gap-2 overflow-x-auto border-b border-(--color-border-default) sm:gap-6"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          aria-pressed={view === tab.value}
          onClick={() => onChange(tab.value)}
          className={`min-w-24 shrink-0 border-b-2 px-3 py-4 text-sm focus-visible:outline-2 focus-visible:outline-(--color-border-brand) ${view === tab.value ? 'border-(--color-border-brand) font-semibold text-(--color-text-brand)' : 'border-transparent text-(--color-text-muted)'}`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
