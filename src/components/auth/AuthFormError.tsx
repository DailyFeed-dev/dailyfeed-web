/**
 * 폼 아래에 서버 오류·계정 상태 문구를 보여주는 영역입니다. (로그인, 비밀번호 찾기·재설정)
 * 스크린 리더가 문구를 바로 읽을 수 있도록 role="alert" 영역은 문구가 없어도 항상 렌더링합니다.
 */
export default function AuthFormError({ message }: { message?: string }) {
  return (
    <div role="alert">
      {message && (
        <p className="mt-4 rounded-[10px] bg-(--color-bg-danger-soft) px-4 py-3 text-center text-sm text-(--color-text-danger)">
          {message}
        </p>
      )}
    </div>
  );
}
