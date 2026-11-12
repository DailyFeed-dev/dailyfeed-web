/** 게시판 상단 배너 (디자인: 배너 66:8004) */
export default function TilBoardBanner() {
  return (
    <section className="flex flex-col gap-2 rounded-xl bg-[linear-gradient(148.8deg,#4b3fd6_0%,#8b7cf6_74%)] px-6 py-10 text-white sm:px-10 sm:py-12">
      <h1 className="text-2xl leading-[1.3] font-bold">TIL · Today I Learned</h1>
      <p className="text-sm leading-[1.6]">
        매일 배운 것을 짧게라도 기록하고 함께 공유하는 공간입니다. 작은 배움이 쌓여 큰 성장이
        됩니다.
      </p>
    </section>
  );
}
