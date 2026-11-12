import type { Schemas } from '@/lib/api';

import ProfileInfoItem from '../../shared/components/ProfileInfoItem';
import { accountLabels, platformLabels, roleLabels } from '../../shared/model/profileOptions';

type Props = { profile: Schemas['AuthResponse'] };

export default function ProfileBasicInfoCard({ profile }: Props) {
  return (
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
          value={profile.accountStatus ? accountLabels[profile.accountStatus] : '상태 정보 없음'}
        />
      </dl>
      <div className="mt-6 rounded-xl bg-[#EFEDFF] p-5 text-xs leading-5">
        <p className="font-semibold">계정 정보 안내</p>
        <p className="mt-1 text-[#858297]">이름·이메일 변경이 필요하면 관리자에게 문의해 주세요.</p>
      </div>
    </section>
  );
}
