'use client';

import { useState } from 'react';
import Dropdown from '@/components/common/Dropdown';
import { BOARD_CATEGORIES } from '../boardCategories';

const OPTIONS = BOARD_CATEGORIES.map(({ code, label }) => ({ value: code, label }));

// 글쓰기 카테고리 선택 — 공용 Dropdown 에 게시판 카테고리 목록을 넣어 씁니다.
// 선택값은 name 으로 폼에 함께 담깁니다. (등록은 API 연결 후 붙여 주세요)
export default function BoardCategorySelect({
  id,
  name = 'category',
}: {
  id: string;
  name?: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Dropdown
      id={id}
      name={name}
      options={OPTIONS}
      value={selected}
      onChange={setSelected}
      placeholder="카테고리를 선택해주세요"
      required
      requiredMessage="카테고리를 선택해 주세요."
    />
  );
}
