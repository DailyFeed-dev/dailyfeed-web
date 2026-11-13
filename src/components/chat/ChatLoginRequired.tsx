'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { buttonClassName } from '@/components/common/Button';

import { CHAT_CANVAS_CLASS } from './chatLayout';
import { chatLoginHref } from './chatLogin';
import ChatStateMessage, { ChatStateIcon } from './ChatStateMessage';

export default function ChatLoginRequired() {
  const searchParams = useSearchParams();

  return (
    <div className={CHAT_CANVAS_CLASS}>
      <section
        aria-label="채팅"
        className="flex flex-1 items-center justify-center rounded-2xl bg-(--color-bg-surface) p-6"
      >
        <ChatStateMessage
          visual={<ChatStateIcon name="message" />}
          title="로그인이 필요해요"
          description="채팅은 로그인한 뒤에 이용할 수 있어요"
        >
          <Link
            href={chatLoginHref(searchParams.toString())}
            className={buttonClassName({ variant: 'primary', size: 'md' })}
          >
            로그인하기
          </Link>
        </ChatStateMessage>
      </section>
    </div>
  );
}
