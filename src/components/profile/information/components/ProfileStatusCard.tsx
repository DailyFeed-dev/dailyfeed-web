import type { Schemas } from '@/lib/api';

import { presenceOptions } from '../../shared/model/profileOptions';

type Props = {
  profile: Schemas['AuthResponse'];
  onEdit: () => void;
};

export default function ProfileStatusCard({ profile, onEdit }: Props) {
  return (
    <section
      className="rounded-2xl bg-white p-6 sm:min-h-67 sm:p-7"
      aria-labelledby="profile-status-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="profile-status-title" className="font-semibold">
          나의 상태
        </h3>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-[#EFEDFF] px-3 py-1 text-xs font-medium text-[#6157E9]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          {presenceOptions.find((option) => option.value === profile.presenceStatus)?.label ||
            '상태 정보 없음'}
        </p>
      </div>
      <p className="mt-6 text-sm leading-6 wrap-anywhere text-[#454257]">
        {profile.statusMessage || '등록된 상태 메시지가 없습니다.'}
      </p>
      <p className="mt-2 text-xs leading-5 text-[#858297]">
        접속 상태와 상태 메시지는 상단 프로필 배너에서 변경할 수 있어요.
      </p>
      <button
        type="button"
        onClick={onEdit}
        className="mt-6 rounded-lg border border-[#ECEAF4] px-4 py-2.5 text-sm font-medium hover:bg-[#F3F2F8]"
      >
        상태 변경
      </button>
    </section>
  );
}
