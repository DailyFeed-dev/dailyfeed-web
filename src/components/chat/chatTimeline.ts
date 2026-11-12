import type { ChatMessage, ChatUserId } from '@/types/chat';

import { formatDayDivider, isSameDay, toDayKey } from './chatTime';

const GROUP_GAP_MS = 5 * 60_000;

export type PendingMessage = {
  clientId: string;
  content: string;
  file: File | null;
  createdAt: string;
  status: 'sending' | 'failed';
  errorMessage: string | null;
};

export type TimelineItem =
  | { kind: 'divider'; key: string; label: string }
  | { kind: 'incoming'; key: string; message: ChatMessage; showHead: boolean }
  | { kind: 'outgoing'; key: string; message: ChatMessage }
  | { kind: 'pending'; key: string; message: PendingMessage };

type TimelineEntry =
  | { source: 'server'; key: string; createdAt: string; message: ChatMessage }
  | { source: 'pending'; key: string; createdAt: string; message: PendingMessage };

type PreviousEntry = { senderId: ChatUserId | null; createdAt: string };

export function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

function sortByTime(messages: ChatMessage[], pending: PendingMessage[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...messages.map((message) => ({
      source: 'server' as const,
      key: message.id,
      createdAt: message.createdAt,
      message,
    })),
    ...pending.map((message) => ({
      source: 'pending' as const,
      key: message.clientId,
      createdAt: message.createdAt,
      message,
    })),
  ];
  return entries.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

function isContinuation(message: ChatMessage, previous: PreviousEntry | null) {
  return (
    previous !== null &&
    previous.senderId === message.senderId &&
    Date.parse(message.createdAt) - Date.parse(previous.createdAt) < GROUP_GAP_MS
  );
}

function toItem(
  entry: TimelineEntry,
  peerId: ChatUserId,
  previousOnSameDay: PreviousEntry | null,
): TimelineItem {
  if (entry.source === 'pending')
    return { kind: 'pending', key: entry.key, message: entry.message };
  const { message } = entry;
  if (message.senderId !== peerId) return { kind: 'outgoing', key: entry.key, message };
  return {
    kind: 'incoming',
    key: entry.key,
    message,
    showHead: !isContinuation(message, previousOnSameDay),
  };
}

export function buildTimeline(
  messages: ChatMessage[],
  pending: PendingMessage[],
  peerId: ChatUserId,
): TimelineItem[] {
  const items: TimelineItem[] = [];
  let previous: PreviousEntry | null = null;

  for (const entry of sortByTime(messages, pending)) {
    const isNewDay =
      previous === null || !isSameDay(new Date(previous.createdAt), new Date(entry.createdAt));
    if (isNewDay) {
      items.push({
        kind: 'divider',
        key: `day-${toDayKey(entry.createdAt)}`,
        label: formatDayDivider(entry.createdAt),
      });
    }
    items.push(toItem(entry, peerId, isNewDay ? null : previous));
    previous = {
      senderId: entry.source === 'server' ? entry.message.senderId : null,
      createdAt: entry.createdAt,
    };
  }

  return items;
}
