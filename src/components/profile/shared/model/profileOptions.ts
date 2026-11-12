export const presenceOptions = [
  { value: 'ONLINE', label: '온라인' },
  { value: 'AWAY', label: '자리 비움' },
  { value: 'BUSY', label: '바쁨' },
  { value: 'OFFLINE', label: '오프라인' },
] as const;

export const roleLabels = {
  STUDENT: '학습자',
  MENTOR: '멘토',
  INSTRUCTOR: '강사',
  OPERATOR: '운영자',
  PROJECT_MANAGER: '프로젝트 매니저',
  PROJECT_LEADER: '프로젝트 리더',
  PLANNER: '기획자',
  DESIGNER: '디자이너',
  DEVELOPER: '개발자',
};

export const platformLabels = {
  USER: '일반 사용자',
  COMPANY_ADMIN: '조직 관리자',
  PLATFORM_ADMIN: '플랫폼 관리자',
};
export const accountLabels = {
  PENDING_APPROVAL: '승인 대기',
  ACTIVE: '정상 이용 중',
  REJECTED: '승인 거절',
};
