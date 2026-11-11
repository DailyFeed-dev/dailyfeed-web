import type { Schemas } from '@/lib/api';

const sampleProfile: Schemas['AuthResponse'] = {
  userId: 1,
  name: '테스트',
  email: 'test@example.com',
  role: 'STUDENT',
  platformRole: 'USER',
  presenceStatus: 'ONLINE',
  statusMessage: '오늘 배운 것을 차근차근 기록해요.',
  accountStatus: 'ACTIVE',
  companyId: 1,
};

let currentProfile = { ...sampleProfile };
let avatarObjectUrl: string | undefined;

export async function getMyProfile(signal?: AbortSignal) {
  signal?.throwIfAborted();

  return { ...currentProfile };
}

export async function updateMyStatus(input: Schemas['UpdateStatusRequest']) {
  if ((input.statusMessage ?? '').length > 60) {
    throw new Error('상태 메시지는 60자 이내로 입력해 주세요.');
  }

  currentProfile = { ...currentProfile, ...input };

  return { ...currentProfile };
}
export async function uploadMyAvatar(file: File) {
  if (file.size === 0 || !file.type.startsWith('image/')) {
    throw new Error('이미지 파일을 선택해 주세요.');
  }
  if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);

  avatarObjectUrl = URL.createObjectURL(file);
  currentProfile = { ...currentProfile, avatarUrl: avatarObjectUrl };

  return { ...currentProfile };
}
export async function deleteMyAvatar() {
  if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);

  avatarObjectUrl = undefined;
  currentProfile = { ...currentProfile, avatarUrl: undefined };

  return { ...currentProfile };
}
