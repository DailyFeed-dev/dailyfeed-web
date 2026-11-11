import type { ChatAdapter, ChatRealtimePort } from '@/types/chat';

const DEFAULT_INTERVAL_MS = 3000;

type Poll = (signal: AbortSignal) => Promise<void>;

function startPolling(poll: Poll, intervalMs: number) {
  if (typeof document === 'undefined') return () => {};

  let timer: ReturnType<typeof setTimeout> | null = null;
  let controller: AbortController | null = null;
  let stopped = false;

  const isVisible = () => document.visibilityState === 'visible';

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const run = async () => {
    clearTimer();
    if (stopped || controller) return;
    controller = new AbortController();
    await poll(controller.signal).catch(() => undefined);
    controller = null;
    if (!stopped && isVisible()) timer = setTimeout(() => void run(), intervalMs);
  };

  const onVisibilityChange = () => {
    if (!isVisible()) {
      clearTimer();
      return;
    }
    if (!timer && !controller) void run();
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  if (isVisible()) void run();

  return () => {
    stopped = true;
    clearTimer();
    controller?.abort();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

export function createPollingChatRealtime(
  ports: Pick<ChatAdapter, 'conversations' | 'messages'>,
  intervalMs = DEFAULT_INTERVAL_MS,
): ChatRealtimePort {
  return {
    subscribeRoom(peerId, onEvent) {
      const seen = new Set<string>();
      return startPolling(async (signal) => {
        const page = await ports.messages.listMessages(peerId, { signal });
        if (signal.aborted) return;
        const fresh = page.messages.filter((message) => !seen.has(message.id));
        if (fresh.length === 0) return;
        for (const message of fresh) seen.add(message.id);
        onEvent({ type: 'messages', messages: fresh });
      }, intervalMs);
    },

    subscribeConversations(onEvent) {
      let lastSnapshot: string | null = null;
      return startPolling(async (signal) => {
        const conversations = await ports.conversations.listConversations(signal);
        if (signal.aborted) return;
        const snapshot = JSON.stringify(conversations);
        if (snapshot === lastSnapshot) return;
        lastSnapshot = snapshot;
        onEvent({ type: 'snapshot', conversations });
      }, intervalMs);
    },
  };
}
