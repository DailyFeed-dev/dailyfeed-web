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
