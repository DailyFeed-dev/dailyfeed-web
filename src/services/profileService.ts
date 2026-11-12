import { api, type Schemas } from '@/lib/api';

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function hasOptionalText(values: unknown[]) {
  return values.every((value) => value == null || typeof value === 'string');
}

function validateProfile(profile: Schemas['AuthResponse']) {
  if (
    !profile ||
    !isNonNegativeInteger(profile.userId) ||
    (profile.companyId != null && !isNonNegativeInteger(profile.companyId)) ||
    !hasOptionalText([
      profile.name,
      profile.email,
      profile.avatarUrl,
      profile.statusMessage,
      profile.role,
      profile.platformRole,
      profile.presenceStatus,
      profile.accountStatus,
    ])
  ) {
    throw new Error('사용자 응답을 확인하지 못했습니다.');
  }

  return profile;
}

function validateRecord(record: Schemas['PostResponse'] | Schemas['TilResponse']) {
  if (
    !record ||
    !isNonNegativeInteger(record.id) ||
    !hasOptionalText([record.title, record.body, record.createdAt]) ||
    ('content' in record && !hasOptionalText([record.content]))
  ) {
    throw new Error('기록 응답을 확인하지 못했습니다.');
  }
}

function validateTilStats(stats: Schemas['MyStatsResponse']) {
  if (
    !stats ||
    !isNonNegativeInteger(stats.totalTilCount) ||
    !isNonNegativeInteger(stats.consecutiveWritingDays) ||
    !isNonNegativeInteger(stats.thisWeekWriteCount) ||
    !Array.isArray(stats.last13WeeksDailyWriteCounts)
  ) {
    throw new Error('TIL 통계 응답을 확인하지 못했습니다.');
  }

  for (const day of stats.last13WeeksDailyWriteCounts) {
    if (
      !day ||
      typeof day.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
      !isNonNegativeInteger(day.count)
    ) {
      throw new Error('일별 TIL 통계 응답을 확인하지 못했습니다.');
    }

    const date = new Date(`${day.date}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== day.date) {
      throw new Error('일별 TIL 날짜를 확인하지 못했습니다.');
    }
  }

  return stats;
}

// 프로필을 불러오는 api로 조회 요청이 들어오다 취소 되어도 중단하는 형태로 만들었다.
// 사용자 데이터가 정상인지 판단하고 정상이면 profile을 반환한다.
// 밑에 양식도 비슷하게 api를 호출합니다.
export async function getMyProfile(signal?: AbortSignal): Promise<Schemas['AuthResponse']> {
  signal?.throwIfAborted();
  const profile = await api.get<Schemas['AuthResponse']>('/api/v1/auth/me', { signal });
  return validateProfile(profile);
}

export async function updateMyStatus(
  input: Schemas['UpdateStatusRequest'],
): Promise<Schemas['AuthResponse']> {
  if (!['ONLINE', 'AWAY', 'BUSY', 'OFFLINE'].includes(input.presenceStatus)) {
    throw new Error('접속 상태를 선택해 주세요.');
  }

  if ((input.statusMessage ?? '').length > 60) {
    throw new Error('상태 메시지는 60자 이내로 입력해 주세요.');
  }

  const profile = await api.patch<Schemas['AuthResponse']>('/api/v1/users/me/status', input);
  return validateProfile(profile);
}

// 잘못된 데이터를 거르는 작업니다. 프로젝트 아이디가 숫자, 소수나 무한대가 아닌 안전한 정수, 0 이상 이 조건을 만족하는지 고릅니다.
// hasOptionalText은 문자열을 검사합니다. 배열 안에 조건을 모두 만족해야 합니다.
export async function getMyProfileProjects(
  signal?: AbortSignal,
): Promise<Schemas['ProjectResponse'][]> {
  signal?.throwIfAborted();
  const projects = await api.get<Schemas['ProjectResponse'][]>('/api/v1/projects', { signal });
  if (!Array.isArray(projects)) throw new Error('프로젝트 목록을 확인하지 못했습니다.');

  for (const project of projects) {
    if (
      !project ||
      !isNonNegativeInteger(project.id) ||
      !hasOptionalText([project.name, project.description])
    ) {
      throw new Error('프로젝트 응답을 확인하지 못했습니다.');
    }
  }

  return projects;
}

function validatePage(
  response: Schemas['PostPageResponse'] | Schemas['TilPageResponse'],
  page: number,
  size: number,
) {
  if (
    !response ||
    !Array.isArray(response.items) ||
    response.page !== page ||
    response.size !== size ||
    typeof response.hasNext !== 'boolean' ||
    response.items.length > size ||
    (response.hasNext && response.items.length === 0)
  ) {
    throw new Error('목록 페이지 응답을 확인하지 못했습니다.');
  }

  response.items.forEach(validateRecord);
}

async function getProfilePostPage(page: number, size: number, signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (!isNonNegativeInteger(page)) throw new Error('페이지 번호를 확인해 주세요.');

  const posts = await api.get<Schemas['PostPageResponse']>('/api/v1/posts/me', {
    query: { page, size },
    signal,
  });
  validatePage(posts, page, size);
  return posts;
}

export function getMyProfilePosts(page: number, signal?: AbortSignal) {
  return getProfilePostPage(page, 3, signal);
}

export async function getMyProfileTils(page: number, size: number, signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (!isNonNegativeInteger(page) || !Number.isSafeInteger(size) || size < 1) {
    throw new Error('페이지 번호와 목록 크기를 확인해 주세요.');
  }
  const tils = await api.get<Schemas['TilPageResponse']>('/api/v1/tils/me', {
    query: { page, size },
    signal,
  });
  validatePage(tils, page, size);
  return tils;
}

export async function getMyProfileTilStats(signal?: AbortSignal) {
  signal?.throwIfAborted();
  const stats = await api.get<Schemas['MyStatsResponse']>('/api/v1/tils/me/stats', { signal });
  return validateTilStats(stats);
}

async function getMyProfilePostCount(signal?: AbortSignal) {
  let page = 0;
  let count = 0;
  // 게시판 API에 전체 개수가 없어 마지막 페이지까지 합산한다.
  while (true) {
    const posts = await getProfilePostPage(page, 100, signal);
    count += posts.items?.length ?? 0;
    if (!posts.hasNext) return count;
    page += 1;
  }
}

export async function getProfileActivity(signal?: AbortSignal) {
  signal?.throwIfAborted();
  const [projects, tilStats, postCount] = await Promise.all([
    getMyProfileProjects(signal),
    getMyProfileTilStats(signal),
    getMyProfilePostCount(signal),
  ]);

  return {
    month: new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
    }).format(new Date()),
    postCount,
    projects,
    tilStats,
  };
}
