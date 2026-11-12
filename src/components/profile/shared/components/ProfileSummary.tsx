'use client';

import type { ReactNode } from 'react';

import type { Schemas } from '@/lib/api';

import ProfileAvatar from './ProfileAvatar';
import { presenceOptions, roleLabels } from '../model/profileOptions';

type ProfileSummaryProps = {
  profile: Schemas['AuthResponse'];
  onEdit: () => void;
  isEditing?: boolean;
  children?: ReactNode;
};

export default function ProfileSummary({
  profile,
  onEdit,
  isEditing = false,
  children,
}: ProfileSummaryProps) {
  const presenceLabel = presenceOptions.find(
    (option) => option.value === profile.presenceStatus,
  )?.label;

  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-[#6157E9] p-6 text-white sm:min-h-52 sm:px-8 sm:py-6"
      aria-label="내 프로필 요약"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-16 size-80 rounded-full border border-white/5 bg-white/5"
      />
      <div className="relative sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <ProfileAvatar src={profile.avatarUrl} name={profile.name} size="summary" />
          <div className="min-w-0">
            <p className="text-[11px] leading-4 font-medium text-white/75">MY WORKSPACE</p>
            <h2 className="mt-1 text-2xl leading-8 font-bold wrap-anywhere">
              {profile.name || '이름 미등록'}
            </h2>
            <p className="mt-1 text-sm leading-5 wrap-anywhere text-white/90">
              {profile.email || '이메일 미등록'}
            </p>
            <p className="mt-1 text-sm leading-5 wrap-anywhere text-white/90">
              {profile.statusMessage || '등록된 상태 메시지가 없습니다.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
              {profile.role && (
                <span className="rounded-full bg-black/10 px-3 py-1">
                  {roleLabels[profile.role]}
                </span>
              )}
              {profile.platformRole && (
                <span className="rounded-full bg-black/10 px-3 py-1">{profile.platformRole}</span>
              )}
            </div>
          </div>
        </div>
        <div className="relative mt-6 flex shrink-0 items-center justify-between gap-4 sm:mt-0 sm:min-h-40 sm:flex-col sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#6157E9]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            {presenceLabel || '상태 정보 없음'}
          </span>
          <button
            type="button"
            onClick={onEdit}
            aria-expanded={isEditing}
            aria-controls="profile-banner-editor"
            className="rounded-lg border border-[#E5E2F3] bg-white px-5 py-3 text-sm font-semibold text-[#454257] hover:bg-[#F3F2F8]"
          >
            {isEditing ? '설정 닫기' : '프로필 설정'}
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}
