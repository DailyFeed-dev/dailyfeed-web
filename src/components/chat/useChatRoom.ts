import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '@/lib/api';
import { chatRealtime, conversationService, messageService } from '@/services/chatService';
import type { ChatAttachment, ChatMessage, ChatUserId } from '@/types/chat';

import { MAX_ATTACHMENT_BYTES } from './chatAttachment';
import { mergeMessages, type PendingMessage } from './chatTimeline';
import { errorMessageOf } from './errorMessage';

type RoomStatus = 'loading' | 'ready' | 'error';

const SEND_FAILED_MESSAGE = '메시지를 보내지 못했어요.';
const FILE_FAILED_MESSAGE = '파일을 보내지 못했어요.';
const FILE_TOO_LARGE_MESSAGE = '파일이 너무 커요.';
const FILE_SIZE_LIMIT_MESSAGE = '10MB 이하 파일만 보낼 수 있어요.';
const PAYLOAD_TOO_LARGE = 413;
const OLDER_FAILED_MESSAGE = '이전 메시지를 불러오지 못했어요.';

function sendErrorOf(error: unknown, file: File | null) {
  if (!file) return errorMessageOf(error, SEND_FAILED_MESSAGE);
  const tooLarge = error instanceof ApiError && error.status === PAYLOAD_TOO_LARGE;
  return tooLarge ? FILE_TOO_LARGE_MESSAGE : errorMessageOf(error, FILE_FAILED_MESSAGE);
}

export function useChatRoom(peerId: ChatUserId) {
  const [status, setStatus] = useState<RoomStatus>('loading');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [olderCursor, setOlderCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [olderError, setOlderError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<unknown>(null);
  const [pending, setPending] = useState<PendingMessage[]>([]);
  const [subscriptionRestartCount, setSubscriptionRestartCount] = useState(0);
  const loadingOlderRef = useRef(false);
  const snapshotGeneration = useRef(0);
  const clientSequence = useRef(0);
  const uploadedAttachments = useRef(new Map<string, ChatAttachment>());

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
    [peerId, subscriptionRestartCount],
  );

  const retryLoad = useCallback(() => {
    setStatus('loading');
    setSyncError(null);
    setSubscriptionRestartCount((count) => count + 1);
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

  const sendFile = useCallback(
    async (clientId: string, file: File) => {
      if (file.size > MAX_ATTACHMENT_BYTES) throw new Error(FILE_SIZE_LIMIT_MESSAGE);
      const attachment =
        uploadedAttachments.current.get(clientId) ?? (await messageService.uploadAttachment(file));
      uploadedAttachments.current.set(clientId, attachment);
      const sent = await messageService.sendAttachment(peerId, attachment);
      uploadedAttachments.current.delete(clientId);
      return sent;
    },
    [peerId],
  );

  const deliver = useCallback(
    async ({ clientId, content, file }: PendingMessage) => {
      setPending((current) =>
        current.map((message) =>
          message.clientId === clientId
            ? { ...message, status: 'sending', errorMessage: null }
            : message,
        ),
      );
      try {
        const sent = file
          ? await sendFile(clientId, file)
          : await messageService.sendMessage(peerId, content);
        setMessages((current) => mergeMessages(current, [sent]));
        setPending((current) => current.filter((message) => message.clientId !== clientId));
      } catch (error) {
        setPending((current) =>
          current.map((message) =>
            message.clientId === clientId
              ? { ...message, status: 'failed', errorMessage: sendErrorOf(error, file) }
              : message,
          ),
        );
      }
    },
    [peerId, sendFile],
  );

  const enqueue = useCallback(
    (content: string, file: File | null) => {
      clientSequence.current += 1;
      const message: PendingMessage = {
        clientId: `local-${clientSequence.current}`,
        content,
        file,
        createdAt: new Date().toISOString(),
        status: 'sending',
        errorMessage: null,
      };
      setPending((current) => [...current, message]);
      void deliver(message);
    },
    [deliver],
  );

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (content) enqueue(content, null);
    },
    [enqueue],
  );

  const attach = useCallback((file: File) => enqueue('', file), [enqueue]);

  const retry = useCallback(
    (clientId: string) => {
      const target = pending.find((message) => message.clientId === clientId);
      if (target) void deliver(target);
    },
    [pending, deliver],
  );

  const discard = useCallback((clientId: string) => {
    uploadedAttachments.current.delete(clientId);
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
    retryLoad,
    loadOlder,
    send,
    attach,
    retry,
    discard,
  };
}
