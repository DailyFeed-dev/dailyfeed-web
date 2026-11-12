import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import type { Schemas } from '@/lib/api';

import ProfileInfoItem from '../../shared/components/ProfileInfoItem';
import type { ProfileView } from '../../profileActivity';
import { accountLabels, platformLabels, roleLabels } from '../../shared/model/profileOptions';

type Props = {
  profile: Schemas['AuthResponse'];
  onViewChange: (view: ProfileView) => void;
};

export default function OverviewAccountCard({ profile, onViewChange }: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 sm:p-7" aria-labelledby="overview-account-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="overview-account-title" className="font-semibold">
          내 계정 정보
        </h3>
        <Badge tone={profile.accountStatus === 'ACTIVE' ? 'success' : 'neutral'}>
          {profile.accountStatus ? accountLabels[profile.accountStatus] : '상태 정보 없음'}
        </Badge>
      </div>
      <dl className="mt-4">
        <ProfileInfoItem label="이름" value={profile.name || '이름 미등록'} />
        <ProfileInfoItem label="이메일" value={profile.email || '이메일 미등록'} />
        <ProfileInfoItem
          label="역할"
          value={
            [
              profile.role && roleLabels[profile.role],
              profile.platformRole && platformLabels[profile.platformRole],
            ]
              .filter(Boolean)
              .join(' · ') || '역할 정보 없음'
          }
        />
        <ProfileInfoItem label="소속 조직 ID" value={String(profile.companyId ?? '정보 없음')} />
      </dl>
      <Button
        variant="outline"
        className="mt-5 border-0"
        onClick={() => onViewChange('information')}
      >
        내 정보 보기 <span aria-hidden="true">→</span>
      </Button>
    </section>
  );
}
