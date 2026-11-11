import type { ChatMessage, ChatUserId } from '@/types/chat';

import { formatDayDivider, isSameDay } from './chatTime';

const GROUP_GAP_MS = 5 * 60_000;

export type PendingMessage = {
  clientId: string;
  content: string;
  createdAt: string;
  status: 'sending' | 'failed';
  errorMessage: string | null;
};

export type TimelineItem =
  | { kind: 'divider'; key: string; label: string }
  | { kind: 'incoming'; key: string; message: ChatMessage; showHead: boolean }
  | { kind: 'outgoing'; key: string; message: ChatMessage }
  | { kind: 'pending'; key: string; message: PendingMessage };

export function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

export function buildTimeline(
  messages: ChatMessage[],
  pending: PendingMessage[],
  peerId: ChatUserId,
): TimelineItem[] {
  const items: TimelineItem[] = [];
  let previous: { senderId: ChatUserId | null; createdAt: string } | null = null;

  const startsNewDay = (createdAt: string) =>
    !previous || !isSameDay(new Date(previous.createdAt), new Date(createdAt));

  const addDividerIfNeeded = (key: string, createdAt: string) => {
    const newDay = startsNewDay(createdAt);
    if (newDay)
      items.push({ kind: 'divider', key: `day-${key}`, label: formatDayDivider(createdAt) });
    return newDay;
  };

  for (const message of messages) {
    const newDay = addDividerIfNeeded(message.id, message.createdAt);
    if (message.senderId !== peerId) {
      items.push({ kind: 'outgoing', key: message.id, message });
    } else {
      const continued =
        !newDay &&
        previous?.senderId === message.senderId &&
        Date.parse(message.createdAt) - Date.parse(previous.createdAt) < GROUP_GAP_MS;
      items.push({ kind: 'incoming', key: message.id, message, showHead: !continued });
    }
    previous = message;
  }

  for (const message of pending) {
    addDividerIfNeeded(message.clientId, message.createdAt);
    items.push({ kind: 'pending', key: message.clientId, message });
    previous = { senderId: null, createdAt: message.createdAt };
  }

  return items;
}
