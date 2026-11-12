type ProfileInfoItemProps = {
  label: string;
  value: string;
};
// 이름과 이메일을 반복적으로 표시하는 부분에서 나눈 컴포넌트
export default function ProfileInfoItem({ label, value }: ProfileInfoItemProps) {
  return (
    <div className="grid gap-1 border-b border-[#ECEAF4] py-[17px] last:border-b-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm leading-5 text-[#858297]">{label}</dt>
      <dd className="min-w-0 text-sm leading-5 font-medium wrap-anywhere text-[#252438]">
        {value}
      </dd>
    </div>
  );
}
