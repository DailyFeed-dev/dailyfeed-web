import { Suspense } from 'react';

import ChatAccess from './ChatAccess';
import { CHAT_CANVAS_CLASS } from './chatLayout';

export default function ChatPage() {
  return (
    <Suspense fallback={<div className={CHAT_CANVAS_CLASS} />}>
      <ChatAccess />
    </Suspense>
  );
}
