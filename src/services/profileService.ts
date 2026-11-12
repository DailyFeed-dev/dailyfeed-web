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

function validateRecord(record: Schemas['PostResponse'] | Schemas['ReflectionResponse']) {
  if (
    !record ||
    !isNonNegativeInteger(record.id) ||
    (record.projectId !== undefined && !isNonNegativeInteger(record.projectId)) ||
    !hasOptionalText([record.title, record.body, record.createdAt, record.kind])
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

export async function getMyProfilePosts(
  page: number,
  signal?: AbortSignal,
): Promise<Schemas['PageResponsePostResponse']> {
  signal?.throwIfAborted();
  if (!isNonNegativeInteger(page)) throw new Error('페이지 번호를 확인해 주세요.');

  const posts = await api.get<Schemas['PageResponsePostResponse']>('/api/v1/me/posts', {
    query: { page, size: 3 },
    signal,
  });

  if (
    !posts ||
    !Array.isArray(posts.items) ||
    posts.page !== page ||
    posts.size !== 3 ||
    !isNonNegativeInteger(posts.totalElements) ||
    posts.items.length > posts.size ||
    posts.items.length > posts.totalElements
  ) {
    throw new Error('게시글 페이지 응답을 확인하지 못했습니다.');
  }

  posts.items.forEach(validateRecord);
  return posts;
}

export async function getProfileActivity(signal?: AbortSignal) {
  signal?.throwIfAborted();
  const [projects, reflections, tilStats, postPage] = await Promise.all([
    getMyProfileProjects(signal),
    api.get<Schemas['ReflectionResponse'][]>('/api/v1/me/reflections', { signal }),
    api.get<Schemas['MyStatsResponse']>('/api/v1/tils/me/stats', { signal }),
    getMyProfilePosts(0, signal),
  ]);

  if (!Array.isArray(reflections)) throw new Error('회고 목록을 확인하지 못했습니다.');
  reflections.forEach(validateRecord);
  validateTilStats(tilStats);

  const postCount = postPage.totalElements;
  if (!isNonNegativeInteger(postCount)) throw new Error('게시글 전체 개수를 확인하지 못했습니다.');

  return {
    month: new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
    }).format(new Date()),
    postCount,
    projects,
    reflections,
    tilStats,
  };
}
