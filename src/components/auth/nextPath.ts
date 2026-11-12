/**
 * 로그인·회원가입 후 돌아갈 주소(?next=)를 다룹니다.
 * 예) 메인의 LoginRequiredLink 가 /login?next=%2Fchat 으로 보내면, 로그인 후 /chat 으로 이동합니다.
 *
 * ?next= 는 누구나 주소창에 적을 수 있는 값이라, 외부 사이트로 보내는 데 악용되지 않도록(open redirect)
 * 우리 사이트 안의 경로만 허용합니다.
 */
export const NEXT_PARAM = 'next';

// 주소 해석에만 쓰는 가짜 기준 주소입니다. 해석 결과가 이 origin 을 벗어나면 외부 주소로 봅니다.
const BASE_ORIGIN = 'https://dailyfeed.invalid';

// 로그인·회원가입 화면으로 다시 보내면 같은 화면이 반복되므로 거부합니다.
const AUTH_ENTRY_PATHS = ['/login', '/signup'];

// 역슬래시, 공백, 제어 문자(탭·줄바꿈 등)입니다.
// 브라우저는 주소의 탭·줄바꿈을 지우고 \ 를 / 로 읽어서 "/\t/example.com" 이 "//example.com" 이 됩니다.
const UNSAFE_CHARS = /[\\\s\u0000-\u001f\u007f]/;

/** 안전한 내부 경로면 정리된 경로를, 아니면 null 을 돌려줍니다. */
export function toSafeNextPath(value: string | null | undefined): string | null {
  // "/" 로 시작하는 경로만 허용합니다. "//example.com" 은 브라우저가 외부 주소로 해석합니다.
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  if (UNSAFE_CHARS.test(value)) return null;
  // http:, https:, javascript: 같은 스킴이 들어간 값은 거부합니다. (우리 경로에는 ':' 가 쓰이지 않습니다)
  if (value.includes(':')) return null;

  let url: URL;
  try {
    url = new URL(value, BASE_ORIGIN);
  } catch {
    return null;
  }
  if (url.origin !== BASE_ORIGIN) return null;
  // "/./login", "/login/" 처럼 모양만 다른 값도 걸러지도록 해석된 경로로 비교합니다.
  const isAuthEntry = AUTH_ENTRY_PATHS.some(
    (path) => url.pathname === path || url.pathname.startsWith(`${path}/`),
  );
  if (isAuthEntry) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * 지금 주소의 ?next= 값을 읽어 안전한 경우에만 돌려줍니다.
 * 렌더링 중이 아니라 제출·클릭·Effect 처럼 브라우저에서 실행되는 시점에만 부릅니다.
 * (렌더링 중에 window 를 읽으면 서버 HTML 과 달라져 하이드레이션 오류가 납니다)
 */
export function readNextPath(): string | null {
  return toSafeNextPath(new URLSearchParams(window.location.search).get(NEXT_PARAM));
}

/** 로그인·회원가입에 성공했을 때 이동할 주소입니다. ?next= 가 없거나 안전하지 않으면 메인(/)입니다. */
export function getPostLoginPath(): string {
  return readNextPath() ?? '/';
}
