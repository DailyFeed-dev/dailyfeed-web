# DailyFeed Web

DailyFeed 프론트엔드 저장소입니다. (Next.js + TypeScript + Tailwind CSS, Vercel 배포)

## 처음 시작하기 (팀원 1회만)

1. **Node.js 22 이상 설치** — 권장 버전은 `.nvmrc` 에 적혀 있습니다. (https://nodejs.org)
2. **저장소 받기**
   ```bash
   git clone https://github.com/DailyFeed-dev/dailyfeed-web.git
   cd dailyfeed-web
   npm install
   ```
   `npm install` 을 하면 커밋 전 자동 검사(husky)도 함께 설치됩니다.
3. **커밋 이메일 확인** — GitHub 계정에 등록된 이메일과 같아야 커밋이 내 프로필에 연결됩니다.
   ```bash
   git config user.email   # GitHub 계정 이메일과 다르면 아래로 변경
   git config user.email "내GitHub이메일@example.com"
   ```
4. **VS Code 확장 설치** — 프로젝트를 열면 오른쪽 아래에 "권장 확장 설치" 알림이 뜹니다. 모두 설치하세요.
   (Prettier, ESLint, Tailwind CSS, EditorConfig) 이후 **저장할 때마다 자동으로 포맷**됩니다.
5. **환경변수** — 필요한 경우 `.env.example` 을 복사해 `.env.local` 을 만들고 값을 채웁니다.
6. **실행**
   ```bash
   npm run dev
   ```
   http://localhost:3000 에서 확인합니다.

## 매일 작업 흐름

```bash
# 1. 최신 develop 받기
git switch develop
git pull

# 2. 내 기능 브랜치 만들기 (이슈 번호-기능 이름)
git switch -c feature/12-login-page

# 3. 코드 작성 → 커밋 (커밋할 때 포맷/린트가 자동으로 돌아갑니다)
git add .
git commit -m "feat: 로그인 폼 UI 추가"

# 4. 올리기
git push -u origin feature/12-login-page
```

5. GitHub에서 **Compare & pull request** → base 가 `develop` 인지 확인 → 템플릿 빈칸 채우기 → PR 생성
6. CI 통과 + 리뷰 승인 1명 → **Squash and merge** (브랜치는 자동 삭제됩니다)

작업이 길어지면 매일 develop 을 내 브랜치에 반영해 충돌을 줄이세요.

```bash
git fetch origin
git merge origin/develop
```

자세한 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md) 를 참고하세요.

## 자주 쓰는 명령어

| 명령어                 | 설명                       |
| ---------------------- | -------------------------- |
| `npm run dev`          | 개발 서버 실행             |
| `npm run build`        | 배포용 빌드 (PR 전 확인용) |
| `npm run lint`         | ESLint 검사                |
| `npm run format`       | 전체 파일 Prettier 정리    |
| `npm run format:check` | 포맷 검사만 (CI와 동일)    |
| `npm run typecheck`    | 타입 검사                  |

## 폴더 구조

```
src/
├── app/                   # 라우트(페이지). 페이지 파일은 얇게 유지하고 실제 UI는 features 에서 가져옵니다.
│   ├── layout.tsx         # [공통] 전체 틀
│   ├── (auth)/            # 헤더 없는 화면 (주소에 (auth) 는 나타나지 않음)
│   └── (main)/            # 헤더 있는 화면 (주소에 (main) 은 나타나지 않음)
│       └── layout.tsx     # [공통] 헤더 + 본문
├── features/              # 기능별 폴더. 각자 맡은 기능 폴더 안에서 작업합니다.
│   └── <기능이름>/
│       ├── components/
│       ├── hooks/
│       └── api.ts
├── components/common/     # [공통] Header, PagePlaceholder 등 (수정 전 팀에 공유)
├── lib/                   # 공통 유틸, API 클라이언트
└── types/                 # 공통 타입
```

## 기능별 담당 위치

각자 아래 두 곳만 수정하면 됩니다. 세부 페이지(예: `/til/123`, `/til/write`)는 자기 라우트 폴더 안에 추가합니다.

| 기능             | 주소             | 실제 코드                   | 페이지 파일                     | 이슈 |
| ---------------- | ---------------- | --------------------------- | ------------------------------- | ---- |
| 메인화면         | `/`              | `src/features/home`         | `src/app/(main)/page.tsx`       | #8   |
| 로그인           | `/login`         | `src/features/auth`         | `src/app/(auth)/login/`         | #4   |
| 채팅             | `/chat`          | `src/features/chat`         | `src/app/(main)/chat/`          | #3   |
| 자료실 게시판    | `/archive`       | `src/features/archive`      | `src/app/(main)/archive/`       | #5   |
| 알림             | `/notifications` | `src/features/notification` | `src/app/(main)/notifications/` | #6   |
| TIL, 학습 게시판 | `/til`           | `src/features/til`          | `src/app/(main)/til/`           | #7   |
| 개인 프로필      | `/profile`       | `src/features/profile`      | `src/app/(main)/profile/`       | #9   |

헤더의 알림 아이콘(`NotificationBell`)과 프로필 메뉴(`ProfileMenu`)는 각 담당자의 features 폴더에 있습니다.
헤더 파일(`components/common/Header.tsx`)을 고치지 않고 자기 컴포넌트만 수정하면 됩니다.
