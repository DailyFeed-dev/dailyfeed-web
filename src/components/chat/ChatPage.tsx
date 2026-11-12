import { Suspense } from 'react';

import ChatScreen from './ChatScreen';

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="mb-6 h-[calc(100dvh-7.75rem)] min-h-[520px] rounded-3xl bg-(--color-bg-subtle)" />
      }
    >
      <ChatScreen />
    </Suspense>
  );
}
