import type { Schemas } from '@/lib/api';

import ProfileInfoItem from './ProfileInfoItem';
import { presenceOptions, roleLabels } from './profileOptions';

type ProfileInfoPanelProps = {
  profile: Schemas['AuthResponse'];
  onEdit: () => void;
};

const platformLabels = {
  USER: '일반 사용자',
  COMPANY_ADMIN: '조직 관리자',
  PLATFORM_ADMIN: '플랫폼 관리자',
};
const accountLabels = {
  PENDING_APPROVAL: '승인 대기',
  ACTIVE: '정상 이용 중',
  REJECTED: '승인 거절',
};
export default function ProfileInfoPanel({ profile, onEdit }: ProfileInfoPanelProps) {
  return (
    <section className="mt-8" aria-labelledby="profile-information-title">
      <h2 id="profile-information-title" className="text-[28px] leading-9 font-bold">
        내 정보
      </h2>
      <p className="mt-2 text-sm leading-5 text-[#858297]">
        계정에 등록된 기본 정보와 현재 상태를 확인하세요.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="rounded-2xl bg-white p-6 sm:p-7" aria-labelledby="profile-basic-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="profile-basic-title" className="font-semibold">
              기본 정보
            </h3>
            <span className="rounded-full bg-[#EFEDFF] px-3 py-1 text-xs font-medium text-[#6157E9]">
              계정에 등록된 정보
            </span>
          </div>
          <dl className="mt-4">
            <ProfileInfoItem label="이름" value={profile.name || '이름 미등록'} />
            <ProfileInfoItem label="이메일" value={profile.email || '이메일 미등록'} />
            <ProfileInfoItem
              label="계정 역할"
              value={profile.role ? roleLabels[profile.role] : '역할 정보 없음'}
            />
            <ProfileInfoItem
              label="플랫폼 역할"
              value={profile.platformRole ? platformLabels[profile.platformRole] : '역할 정보 없음'}
            />
            <ProfileInfoItem
              label="계정 상태"
              value={
                profile.accountStatus ? accountLabels[profile.accountStatus] : '상태 정보 없음'
              }
            />
          </dl>
          <div className="mt-6 rounded-xl bg-[#EFEDFF] p-5 text-xs leading-5">
            <p className="font-semibold">계정 정보 안내</p>
            <p className="mt-1 text-[#858297]">
              이름·이메일 변경이 필요하면 관리자에게 문의해 주세요.
            </p>
          </div>
        </section>

        <div className="space-y-6">
          <section
            className="rounded-2xl bg-white p-6 sm:min-h-[180px] sm:p-7"
            aria-labelledby="profile-company-title"
          >
            <h3 id="profile-company-title" className="font-semibold">
              소속 정보
            </h3>
            <p className="mt-5 text-sm wrap-anywhere text-[#77758A]">
              소속 조직 ID: {profile.companyId ?? '정보 없음'}
            </p>
          </section>
          <section
            className="rounded-2xl bg-white p-6 sm:min-h-[268px] sm:p-7"
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
              프로필 이미지와 상태는 설정에서 변경할 수 있어요.
            </p>
            <button
              type="button"
              onClick={onEdit}
              className="mt-6 rounded-lg border border-[#ECEAF4] px-4 py-2.5 text-sm font-medium hover:bg-[#F3F2F8]"
            >
              프로필 설정으로
            </button>
          </section>
        </div>
      </div>
    </section>
  );
}
