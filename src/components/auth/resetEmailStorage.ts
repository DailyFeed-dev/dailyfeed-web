/**
 * 비밀번호 찾기(04)에서 입력한 이메일을 새 비밀번호 설정(06)으로 넘기는 저장소입니다.
 * 주소(URL)에 이메일이 남지 않도록 sessionStorage(탭을 닫으면 사라짐)를 씁니다.
 * 사생활 보호 모드 등에서 저장소 접근이 막혀도 화면이 깨지지 않도록 오류는 무시합니다.
 */
const KEY = 'dailyfeed.passwordResetEmail';

export const resetEmailStorage = {
  get(): string {
    try {
      return window.sessionStorage.getItem(KEY) ?? '';
    } catch {
      return '';
    }
  },
  set(email: string) {
    try {
      window.sessionStorage.setItem(KEY, email);
    } catch {
      // 저장하지 못해도 06 에서 이메일을 직접 입력하면 됩니다.
    }
  },
  clear() {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      // 지우지 못해도 탭을 닫으면 사라집니다.
    }
  },
};
