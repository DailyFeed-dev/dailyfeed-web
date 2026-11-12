import { useCallback, useEffect, useState } from 'react';

import { messageService } from '@/services/chatService';
import type { ChatAttachment, ChatUserId } from '@/types/chat';

const REVOKE_DOWNLOAD_URL_MS = 30_000;
const NEAR_VIEWPORT_MARGIN = '200px';

type LoadedImage = { key: string; url: string | null; failed: boolean };

type DownloadStatus = 'idle' | 'downloading' | 'failed';

export function useNearViewport() {
  const [near, setNear] = useState(false);

  const observe = useCallback(
    (node: Element | null) => {
      if (!node || near) return;
      if (typeof IntersectionObserver === 'undefined') {
        setNear(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          setNear(true);
          observer.disconnect();
        },
        { rootMargin: NEAR_VIEWPORT_MARGIN },
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [near],
  );

  return { near, observe };
}

export function useAttachmentImage(
  peerId: ChatUserId,
  attachment: ChatAttachment,
  enabled: boolean,
) {
  const { name, path, mime, size } = attachment;
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const key = `${peerId}:${path}:${attempt}`;

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;
    messageService
      .downloadAttachment(peerId, { name, path, mime, size }, controller.signal)
      .then((blob) => {
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(new Blob([blob], { type: mime }));
        setLoaded({ key, url: objectUrl, failed: false });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoaded({ key, url: null, failed: true });
      });
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [enabled, key, peerId, name, path, mime, size]);

  const current = loaded?.key === key ? loaded : null;
  return {
    url: current?.url ?? null,
    failed: current?.failed ?? false,
    retry: () => setAttempt((count) => count + 1),
  };
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/octet-stream' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DOWNLOAD_URL_MS);
}

export function useAttachmentDownload(peerId: ChatUserId, attachment: ChatAttachment) {
  const [status, setStatus] = useState<DownloadStatus>('idle');

  const download = async () => {
    if (status === 'downloading') return;
    setStatus('downloading');
    try {
      const blob = await messageService.downloadAttachment(peerId, attachment);
      saveBlob(blob, attachment.name);
      setStatus('idle');
    } catch {
      setStatus('failed');
    }
  };

  return { status, download };
}
