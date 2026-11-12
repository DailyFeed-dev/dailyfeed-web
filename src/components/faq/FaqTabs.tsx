'use client';

import { useLayoutEffect, useState } from 'react';

import FaqList from './FaqList';
import { FAQ_CATEGORIES } from './faqItems';

const FIRST_KEY = FAQ_CATEGORIES[0].key;

/**
 * 주제 탭 + 질문 목록
 * 탭(가입 · 로그인 / TIL / 게시판 / 채팅 · 친구)을 누르면 그 주제의 질문만 보여 줘요.
 * 어떤 탭이 눌렸는지 기억해야 해서 클라이언트 컴포넌트예요.
 */
export default function FaqTabs() {
  const [selectedKey, setSelectedKey] = useState(FIRST_KEY);

  // cacheComponents 때문에 다른 화면으로 가도 이 화면이 숨겨진 채 남아서, 보던 탭이 그대로 기억돼요.
  // 화면을 떠날 때(숨겨질 때) 첫 탭으로 되돌려서, FAQ 에 들어오면 항상 "가입 · 로그인"부터 보여요.
  // (로그인 · 회원가입 화면과 같은 방식 · docs: preserving-ui-state)
  useLayoutEffect(() => {
    return () => setSelectedKey(FIRST_KEY);
  }, []);

  const selected =
    FAQ_CATEGORIES.find((category) => category.key === selectedKey) ?? FAQ_CATEGORIES[0];

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="FAQ 주제"
        className="flex flex-wrap justify-center gap-2 sm:gap-3"
      >
        {FAQ_CATEGORIES.map((category) => {
          const isSelected = category.key === selected.key;
          return (
            <button
              key={category.key}
              type="button"
              role="tab"
              id={`faq-tab-${category.key}`}
              aria-selected={isSelected}
              aria-controls="faq-panel"
              onClick={() => setSelectedKey(category.key)}
              className={`rounded-full px-5 py-2.5 text-[15px] leading-[1.5] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand) ${
                isSelected
                  ? 'bg-(--color-bg-brand-soft) text-(--color-text-brand)'
                  : 'bg-(--color-bg-subtle) text-(--color-text-secondary) hover:text-(--color-text-primary)'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${selected.key}`}>
        {/* key: 탭을 바꾸면 목록을 새로 그려서, 새 주제의 첫 질문이 펼쳐진 상태로 시작해요 */}
        <FaqList key={selected.key} items={selected.items} />
      </div>
    </div>
  );
}
