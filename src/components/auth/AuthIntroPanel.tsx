/**
 * Auth 화면 왼쪽의 서비스 소개 패널입니다. 7개 Auth 화면이 모두 같은 내용을 보여줘서 props 가 없습니다.
 * 1024px 이상에서만 보입니다.
 */
export default function AuthIntroPanel() {
  return (
    <aside
      aria-label="DailyFeed 소개"
      className="hidden max-w-[594px] min-w-0 flex-1 flex-col self-start rounded-[24px] bg-(--auth-primary) px-[54px] pt-16 pb-[45px] break-keep lg:flex lg:min-h-[840px]"
    >
      <p className="text-sm leading-[17px] font-semibold text-[#d9d5ff]">DAILYFEED</p>
      <p className="mt-[61px] text-[40px] leading-[58px] font-bold text-white">
        함께 배우고,
        <br />
        생각을 나누는 공간
      </p>
      <p className="mt-[19px] text-[17px] leading-[25px] text-[#efedff]">
        공부하며 쌓은 지식과 고민을 나누고
        <br />
        서로의 성장을 응원해 보세요.
      </p>

      <div className="mt-[129px] rounded-2xl bg-white px-7 pt-[26px] pb-[33px]">
        <p className="text-sm leading-5 font-medium text-[#756bf0]">우리의 배움이 모이는 곳</p>
        <p className="mt-[13px] text-[21px] leading-[30px] font-bold">오늘의 배움을 공유해요</p>
        <p className="mt-3.5 text-[15px] leading-[22px] whitespace-pre-wrap text-[#77758a]">
          {'자료실  ·  TIL  ·  자유로운 이야기'}
        </p>
        <span className="mt-[26px] flex h-9 w-fit items-center rounded-[9px] bg-[#f0eeff] px-[13px] text-[13px] font-medium text-[#6256e8]">
          학습 커뮤니티
        </span>
      </div>

      <p className="mt-auto pt-10 text-sm text-[#dad7ff]">Learn together, grow together.</p>
    </aside>
  );
}
