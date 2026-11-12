import Icon from '@/components/common/Icon';

import { FAQ_ITEMS } from './faqItems';

/**
 * 질문을 누르면 답이 펼쳐지는 FAQ 목록 (아코디언)
 * - HTML 기본 기능(details · summary)이라 자바스크립트 없이 동작해요. (서버 컴포넌트)
 * - 키보드(Tab · Enter)로도 열고 닫을 수 있어요.
 * - 첫 번째 질문은 처음부터 열어 둬요. (어떻게 쓰는 목록인지 바로 보이도록)
 */
export default function FaqList() {
  return (
    <ul className="flex flex-col gap-3">
      {FAQ_ITEMS.map((item, i) => (
        <li key={item.question}>
          <details
            open={i === 0}
            className="group rounded-2xl border border-(--color-border-default) bg-(--color-bg-surface) transition-colors open:border-(--color-border-brand-soft)"
          >
            {/* list-none + marker 숨김: 브라우저 기본 ▶ 표시 대신 오른쪽 화살표를 씀 */}
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-6 py-5 hover:bg-(--color-bg-subtle) group-open:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden="true"
                className="font-mono text-[16px] leading-[1.5] font-bold text-(--color-text-brand)"
              >
                Q
              </span>
              <span className="flex-1 text-[16px] leading-[1.5] font-semibold text-(--color-text-primary)">
                {item.question}
              </span>
              <Icon
                name="chevron-down"
                size={20}
                className="shrink-0 text-(--color-text-muted) transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            {/* 왼쪽 여백 = 바깥 여백 24 + Q 글자 폭 약 10 + 사이 간격 12 → 질문 글자와 줄을 맞춤 */}
            <p className="px-6 pb-5 pl-[46px] text-[14px] leading-[1.55] text-(--color-text-secondary)">
              {item.answer}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
