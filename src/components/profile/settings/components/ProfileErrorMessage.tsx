// 오류 문장을 보여주는 역할만 가지고 있다 즉 어떤 오류가 만들어지는지는 이 컴포넌트에서는 결정 안한다.

type ProfileErrorMessageProps = {
  id: string;
  error?: string;
};

export default function ProfileErrorMessage({ id, error }: ProfileErrorMessageProps) {
  if (!error) return null;

  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red-700">
      {error}
    </p>
  );
}
