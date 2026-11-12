import ProfileBasicInfoCard from './components/ProfileBasicInfoCard';
import ProfileCompanyCard from './components/ProfileCompanyCard';
import ProfileStatusCard from './components/ProfileStatusCard';
import type { Schemas } from '@/lib/api';

// 내 정보 탭을 선택했을 때 본문에 나오는 화면
type ProfileInfoPanelProps = {
  profile: Schemas['AuthResponse'];
  onEdit: () => void;
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
        <ProfileBasicInfoCard profile={profile} />

        <div className="space-y-6">
          <ProfileCompanyCard companyId={profile.companyId} />
          <ProfileStatusCard profile={profile} onEdit={onEdit} />
        </div>
      </div>
    </section>
  );
}
