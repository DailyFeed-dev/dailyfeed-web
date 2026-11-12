import type { Schemas } from '@/lib/api';

type Props = { companyId: Schemas['AuthResponse']['companyId'] };

export default function ProfileCompanyCard({ companyId }: Props) {
  return (
    <section
      className="rounded-2xl bg-white p-6 sm:min-h-45 sm:p-7"
      aria-labelledby="profile-company-title"
    >
      <h3 id="profile-company-title" className="font-semibold">
        소속 정보
      </h3>
      <p className="mt-5 text-sm wrap-anywhere text-[#77758A]">
        소속 조직 ID: {companyId ?? '정보 없음'}
      </p>
    </section>
  );
}
