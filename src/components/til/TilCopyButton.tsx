'use client';

import { useState } from 'react';

import { TilIcon } from './TilTempUi';

/** 코드 블록의 '복사' 버튼 */
export default function TilCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // http 환경이나 권한 문제로 클립보드가 막힐 수 있습니다.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-[#8e8ca3] hover:text-[#e6e4f2]"
    >
      <TilIcon name="copy" />
      <span>{copied ? '복사됨' : '복사'}</span>
    </button>
  );
}
