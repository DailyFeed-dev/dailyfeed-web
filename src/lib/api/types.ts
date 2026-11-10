import type { components, paths } from './schema';

/**
 * 백엔드 API 의 요청/응답 타입입니다. (src/lib/api/schema.d.ts 에서 자동 생성)
 *
 * @example
 * import type { Schemas } from '@/lib/api';
 * type Post = Schemas['PostResponse'];
 */
export type Schemas = components['schemas'];
export type ApiPaths = paths;

/** 백엔드 공통 응답 형식: { success, message, data, code } */
export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  code?: string;
  data?: T;
};

/** 목록 API 의 페이지 응답 형식 */
export type PageResponse<T> = {
  items?: T[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

/** API 실패 시 던져지는 에러. message 에 서버가 보낸 메시지가 들어 있습니다. */
export class ApiError extends Error {
  constructor(
    message: string,
    /** HTTP 상태 코드 (예: 400, 401, 403, 404, 500) */
    public readonly status: number,
    /** 백엔드 에러 코드 (응답의 code 값, 없을 수 있음) */
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
