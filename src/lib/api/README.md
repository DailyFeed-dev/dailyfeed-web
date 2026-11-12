# API 사용 가이드

백엔드 API 는 모두 이 폴더의 `api` 함수로 호출합니다. 각자 `fetch` 를 직접 쓰지 마세요.

## 처음 설정 (1회)

`.env.example` 을 복사해 `.env.local` 을 만들고 `API_PROXY_TARGET` 에 백엔드 주소를 넣습니다. (값은 팀 채널 참고)
`.env.local` 을 바꾼 뒤에는 `npm run dev` 를 다시 실행해야 적용됩니다.

## 기본 사용법

```tsx
'use client';

import { api, ApiError, type PageResponse, type Schemas } from '@/lib/api';

// 조회 (응답의 data 만 돌려줍니다)
const me = await api.get<Schemas['AuthResponse']>('/api/v1/auth/me');

// 쿼리 파라미터
const posts = await api.get<PageResponse<Schemas['PostResponse']>>(
  `/api/v1/projects/${projectId}/posts`,
  { query: { page: 0, size: 20 } },
);

// 생성 (JSON 본문)
await api.post(`/api/v1/projects/${projectId}/posts`, { title, body });

// 파일 업로드 (FormData 를 넘기면 자동으로 multipart 로 보냅니다)
const form = new FormData();
form.append('file', file);
await api.post(`/api/v1/projects/${projectId}/documents`, form, { query: { title } });

// 에러 처리
try {
  await api.delete(`/api/v1/projects/${projectId}/posts/${postId}`);
} catch (e) {
  if (e instanceof ApiError) alert(e.message); // 서버가 보낸 메시지
}
```

## 로그인 처리 (로그인 담당)

```ts
import { api, tokenStorage, type Schemas } from '@/lib/api';

const auth = await api.post<Schemas['AuthResponse']>(
  '/api/v1/auth/login',
  { email, password },
  { skipAuth: true },
);
tokenStorage.setTokens(auth); // 이후 모든 요청에 토큰이 자동으로 붙습니다

// 로그아웃
tokenStorage.clear();
```

- 토큰이 만료되면(401) 자동으로 `/api/v1/auth/refresh` 로 갱신한 뒤 한 번 다시 시도합니다.
- 갱신도 실패하면 토큰을 지우고 `ApiError(401)` 를 던집니다. 로그인 화면으로 보내는 처리는 로그인 담당이 추가합니다.
- 토큰 저장 방식을 바꾸려면 `token-storage.ts` 만 수정하면 됩니다.

## 타입

- 요청/응답 타입은 `Schemas['이름']` 으로 씁니다. 에디터에서 `Schemas['` 까지 치면 자동완성됩니다.
- 이름은 백엔드 Swagger 의 Schemas 목록과 같습니다. (예: `PostResponse`, `DocumentResponse`, `NotificationResult`)
- `schema.d.ts` 는 자동 생성 파일이라 직접 수정하지 않습니다.
- 백엔드 API 가 바뀌면 타입을 다시 만듭니다. API 문서가 로그인을 요구하므로 파일로 만듭니다.
  1. Swagger 에 로그인된 브라우저에서 `<백엔드주소>/v3/api-docs` 를 열어 `api-docs.json` 으로 저장
  2. 아래 명령 실행 (저장한 json 파일은 커밋하지 않고 지워도 됩니다)

```bash
npm run api:types -- ./api-docs.json
```

## 참고

- 브라우저(클라이언트 컴포넌트, `'use client'`)에서 사용하는 것을 기준으로 만들었습니다.
- 거의 모든 API 에 `projectId` 가 필요합니다. 어떤 프로젝트 ID 를 쓸지는 팀에서 정한 뒤 공통 상수로 추가할 예정입니다.
