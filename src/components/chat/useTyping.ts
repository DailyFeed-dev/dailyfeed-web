import { useCallback, useEffect, useRef, useState } from 'react';

import { chatRealtime, typingService } from '@/services/chatService';
import type { ChatUserId } from '@/types/chat';

const SHOW_TYPING_MAX_MS = 6000;
const RESEND_TYPING_EVERY_MS = 3000;
const STOP_TYPING_AFTER_IDLE_MS = 3000;

export function usePeerTyping(peerId: ChatUserId) {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    const clearHideTimer = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
    };
    const unsubscribe = chatRealtime.subscribeTyping(peerId, (next) => {
      clearHideTimer();
      setTyping(next);
      if (next) hideTimer = setTimeout(() => setTyping(false), SHOW_TYPING_MAX_MS);
    });
    return () => {
      clearHideTimer();
      unsubscribe();
    };
  }, [peerId]);

  return typing;
}

export function useTypingSender(peerId: ChatUserId, enabled: boolean) {
  const sentTyping = useRef(false);
  const lastTypingSentAt = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const send = useCallback(
    (typing: boolean) => {
      sentTyping.current = typing;
      typingService.sendTyping(peerId, typing).catch(() => undefined);
    },
    [peerId],
  );

  const stopTyping = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = null;
    if (sentTyping.current) send(false);
  }, [send]);

  const onDraftChange = (text: string) => {
    if (!enabled || !text.trim()) {
      stopTyping();
      return;
    }
    const now = Date.now();
    if (!sentTyping.current || now - lastTypingSentAt.current >= RESEND_TYPING_EVERY_MS) {
      lastTypingSentAt.current = now;
      send(true);
    }
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(stopTyping, STOP_TYPING_AFTER_IDLE_MS);
  };

  useEffect(() => {
    if (!enabled) stopTyping();
  }, [enabled, stopTyping]);

  useEffect(() => stopTyping, [stopTyping]);

  return { onDraftChange, stopTyping };
}
