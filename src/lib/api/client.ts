import { tokenStorage } from './token-storage';
import { ApiError, type ApiEnvelope, type Schemas } from './types';

/**
 * 모든 요청은 우리 사이트 주소(/api/...)로 보내고,
 * next.config.ts 의 프록시(rewrites)가 백엔드 서버로 전달합니다.
 * → https 배포 사이트에서 http 백엔드를 불러도 브라우저가 막지 않습니다.
 *
 * ⚠️ 브라우저(클라이언트 컴포넌트, 'use client')에서 사용하는 것을 기준으로 만들었습니다.
 */

type Query = Record<string, string | number | boolean | undefined | null>;

type RequestOptions = {
  /** URL 뒤에 붙는 쿼리 파라미터. undefined/null 값은 빠집니다. */
  query?: Query;
  /** JSON 으로 보낼 본문. FormData 를 넘기면 파일 업로드(multipart)로 보냅니다. */
  body?: unknown;
  /** 로그인 토큰을 붙이지 않을 때 true (로그인, 회원가입 등) */
  skipAuth?: boolean;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: Query) {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function parseEnvelope<T>(res: Response): Promise<ApiEnvelope<T> | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as ApiEnvelope<T>;
  } catch {
    return null;
  }
}

// 동시에 여러 요청이 401 을 받아도 토큰 갱신은 한 번만 하도록 공유합니다.
let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) return false;

  refreshing ??= (async () => {
    try {
      const res = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await parseEnvelope<Schemas['AuthResponse']>(res);
      if (!res.ok || !json?.data?.accessToken) return false;
      tokenStorage.setTokens(json.data);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

async function send(
  method: string,
  path: string,
  { query, body, skipAuth, signal }: RequestOptions = {},
  isRetry = false,
): Promise<Response> {
  const headers: Record<string, string> = {};
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  const accessToken = skipAuth ? null : tokenStorage.getAccessToken();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    signal,
  });

  // 토큰 만료 → 한 번만 갱신 후 다시 시도
  if (res.status === 401 && !skipAuth && !isRetry) {
    if (await refreshTokens()) {
      return send(method, path, { query, body, skipAuth, signal }, true);
    }
    tokenStorage.clear();
  }

  return res;
}

function toApiError(res: Response, json: ApiEnvelope<unknown> | null) {
  return new ApiError(
    json?.message ?? `요청에 실패했습니다. (${res.status})`,
    res.status,
    json?.code,
  );
}

async function request<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
  const res = await send(method, path, options);
  const json = await parseEnvelope<T>(res);

  if (!res.ok || json?.success === false) throw toApiError(res, json);

  return json?.data as T;
}

async function requestBlob(path: string, options?: RequestOptions): Promise<Blob> {
  const res = await send('GET', path, options);
  if (!res.ok) throw toApiError(res, await parseEnvelope<unknown>(res));
  return res.blob();
}

/**
 * 공통 API 함수. 응답의 data 만 돌려줍니다.
 *
 * @example
 * import { api, type Schemas, type PageResponse } from '@/lib/api';
 *
 * const me = await api.get<Schemas['AuthResponse']>('/api/v1/auth/me');
 * const posts = await api.get<PageResponse<Schemas['PostResponse']>>(
 *   `/api/v1/projects/${projectId}/posts`,
 *   { query: { page: 0, size: 20 } },
 * );
 */
export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('GET', path, options),
  getBlob: (path: string, options?: Omit<RequestOptions, 'body'>) => requestBlob(path, options),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>('DELETE', path, options),
};
