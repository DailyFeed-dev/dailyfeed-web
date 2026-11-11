import { useCallback, useEffect, useRef, useState } from 'react';

import { chatRealtime, conversationService, messageService } from '@/services/chatService';
import type { ChatMessage, ChatUserId } from '@/types/chat';

import { mergeMessages, type PendingMessage } from './chatTimeline';
import { errorMessageOf } from './errorMessage';

type RoomStatus = 'loading' | 'ready' | 'error';

const SEND_FAILED_MESSAGE = '메시지를 보내지 못했어요.';
const OLDER_FAILED_MESSAGE = '이전 메시지를 불러오지 못했어요.';

export function useChatRoom(peerId: ChatUserId) {
  const [status, setStatus] = useState<RoomStatus>('loading');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [olderCursor, setOlderCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [olderError, setOlderError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<unknown>(null);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [connection, setConnection] = useState(0);
  const loadingOlderRef = useRef(false);
  const snapshotGeneration = useRef(0);
  const clientSequence = useRef(0);

  useEffect(
    () =>
      chatRealtime.subscribeRoom(peerId, (event) => {
        if (event.type === 'snapshot') {
          snapshotGeneration.current += 1;
          setMessages(event.messages);
          setOlderCursor(event.olderCursor);
          setStatus('ready');
          setSyncError(null);
          return;
        }
        if (event.type === 'messages') {
          setMessages((current) => mergeMessages(current, event.messages));
          setSyncError(null);
          return;
        }
        setSyncError(event.error);
        setStatus((current) => (current === 'loading' ? 'error' : current));
      }),
    [peerId, connection],
  );

  const reconnect = useCallback(() => {
    setStatus('loading');
    setSyncError(null);
    setConnection((current) => current + 1);
  }, []);

  const loadOlder = useCallback(async () => {
    if (!olderCursor || loadingOlderRef.current) return;
    loadingOlderRef.current = true;
    setLoadingOlder(true);
    setOlderError(null);
    const requestedSnapshotGeneration = snapshotGeneration.current;
    const snapshotChanged = () => requestedSnapshotGeneration !== snapshotGeneration.current;
    try {
      const page = await messageService.listMessages(peerId, { before: olderCursor });
      if (snapshotChanged()) return;
      setMessages((current) => mergeMessages(page.messages, current));
      setOlderCursor(page.olderCursor);
    } catch (error) {
      if (snapshotChanged()) return;
      setOlderError(errorMessageOf(error, OLDER_FAILED_MESSAGE));
    } finally {
      loadingOlderRef.current = false;
      setLoadingOlder(false);
    }
  }, [peerId, olderCursor]);

  const deliver = useCallback(
    async (clientId: string, content: string) => {
      setPending((current) =>
        current.map((message) =>
          message.clientId === clientId
            ? { ...message, status: 'sending', errorMessage: null }
            : message,
        ),
      );
      try {
        const sent = await messageService.sendMessage(peerId, content);
        setMessages((current) => mergeMessages(current, [sent]));
        setPending((current) => current.filter((message) => message.clientId !== clientId));
      } catch (error) {
        setPending((current) =>
          current.map((message) =>
            message.clientId === clientId
              ? {
                  ...message,
                  status: 'failed',
                  errorMessage: errorMessageOf(error, SEND_FAILED_MESSAGE),
                }
              : message,
          ),
        );
      }
    },
    [peerId],
  );

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content) return;
      clientSequence.current += 1;
      const clientId = `local-${clientSequence.current}`;
      setPending((current) => [
        ...current,
        {
          clientId,
          content,
          createdAt: new Date().toISOString(),
          status: 'sending',
          errorMessage: null,
        },
      ]);
      void deliver(clientId, content);
    },
    [deliver],
  );

  const retry = useCallback(
    (clientId: string) => {
      const target = pending.find((message) => message.clientId === clientId);
      if (target) void deliver(clientId, target.content);
    },
    [pending, deliver],
  );

  const discard = useCallback((clientId: string) => {
    setPending((current) => current.filter((message) => message.clientId !== clientId));
  }, []);

  const lastMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    if (!lastMessageId) return;
    conversationService.markConversationRead(peerId, lastMessageId).catch(() => undefined);
  }, [peerId, lastMessageId]);

  return {
    status,
    messages,
    pending,
    hasOlder: olderCursor !== null,
    loadingOlder,
    olderError,
    syncError,
    reconnect,
    loadOlder,
    send,
    retry,
    discard,
  };
}
