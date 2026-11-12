import { useEffect, useState } from 'react';

import { messageService } from '@/services/chatService';
import type { ChatAttachment, ChatUserId } from '@/types/chat';

const REVOKE_DOWNLOAD_URL_MS = 30_000;

type LoadedImage = { key: string; url: string | null; failed: boolean };

type DownloadStatus = 'idle' | 'downloading' | 'failed';

export function useAttachmentImage(peerId: ChatUserId, attachment: ChatAttachment) {
  const { name, path, mime, size } = attachment;
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const key = `${peerId}:${path}:${attempt}`;

  useEffect(() => {
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
  }, [key, peerId, name, path, mime, size]);

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
