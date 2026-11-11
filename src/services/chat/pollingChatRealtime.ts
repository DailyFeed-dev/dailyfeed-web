import type {
  ChatAdapter,
  ChatMessagePage,
  ChatMessagePort,
  ChatRealtimePort,
  ChatUserId,
} from '@/types/chat';

const DEFAULT_INTERVAL_MS = 3000;
const MAX_CATCH_UP_PAGES = 5;

type Poll = (signal: AbortSignal) => Promise<void>;

function startPolling(poll: Poll, onError: (error: unknown) => void, intervalMs: number) {
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
    const current = new AbortController();
    controller = current;
    try {
      await poll(current.signal);
    } catch (error) {
      if (!current.signal.aborted) onError(error);
    } finally {
      controller = null;
      if (!stopped && isVisible()) timer = setTimeout(() => void run(), intervalMs);
    }
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

async function loadSinceSeen(
  messages: ChatMessagePort,
  peerId: ChatUserId,
  seen: Set<string>,
  signal: AbortSignal,
) {
  const latest = await messages.listMessages(peerId, { signal });
  const pages = [latest.messages];
  let cursor = latest.olderCursor;
  let reachedSeen = latest.messages.some(({ id }) => seen.has(id));
  for (let count = 1; !reachedSeen && cursor && count < MAX_CATCH_UP_PAGES; count += 1) {
    const older = await messages.listMessages(peerId, { before: cursor, signal });
    pages.unshift(older.messages);
    cursor = older.olderCursor;
    reachedSeen = older.messages.some(({ id }) => seen.has(id));
  }
  return { latest, tooFarBehind: !reachedSeen && cursor !== null, messages: pages.flat() };
}

export function createPollingChatRealtime(
  ports: Pick<ChatAdapter, 'conversations' | 'messages'>,
  intervalMs = DEFAULT_INTERVAL_MS,
): ChatRealtimePort {
  return {
    subscribeRoom(peerId, onEvent) {
      let seen: Set<string> | null = null;
      let recovering = false;

      const sendSnapshot = (page: ChatMessagePage) => {
        seen = new Set(page.messages.map(({ id }) => id));
        onEvent({ type: 'snapshot', ...page });
      };

      const poll = async (signal: AbortSignal) => {
        const known = seen;
        if (!known) {
          const page = await ports.messages.listMessages(peerId, { signal });
          if (!signal.aborted) sendSnapshot(page);
          return;
        }
        const update = await loadSinceSeen(ports.messages, peerId, known, signal);
        if (signal.aborted) return;
        if (update.tooFarBehind) {
          sendSnapshot(update.latest);
          return;
        }
        const fresh = update.messages.filter(({ id }) => !known.has(id));
        if (fresh.length === 0 && !recovering) return;
        for (const { id } of fresh) known.add(id);
        onEvent({ type: 'messages', messages: fresh });
      };

      return startPolling(
        async (signal) => {
          await poll(signal);
          recovering = false;
        },
        (error) => {
          recovering = true;
          onEvent({ type: 'error', error });
        },
        intervalMs,
      );
    },

    subscribeConversations(onEvent) {
      let lastSnapshot: string | null = null;
      return startPolling(
        async (signal) => {
          const conversations = await ports.conversations.listConversations(signal);
          if (signal.aborted) return;
          const snapshot = JSON.stringify(conversations);
          if (snapshot === lastSnapshot) return;
          lastSnapshot = snapshot;
          onEvent({ type: 'snapshot', conversations });
        },
        (error) => {
          lastSnapshot = null;
          onEvent({ type: 'error', error });
        },
        intervalMs,
      );
    },
  };
}
