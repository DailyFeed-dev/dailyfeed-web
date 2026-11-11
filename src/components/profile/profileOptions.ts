// api에 사용할 데이터 임시 저장
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
