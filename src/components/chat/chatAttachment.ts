import type { ChatMessage } from '@/types/chat';

const PREVIEW_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/bmp',
];
const SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];
const MAX_EXTENSION_LENGTH = 5;
const UPLOAD_BODY_LIMIT_BYTES = 10 * 1024 * 1024;
const MULTIPART_MARGIN_BYTES = 64 * 1024;

export const MAX_ATTACHMENT_BYTES = UPLOAD_BODY_LIMIT_BYTES - MULTIPART_MARGIN_BYTES;

export function isPreviewImage(mime: string) {
  return PREVIEW_IMAGE_TYPES.includes(mime.toLowerCase());
}

export function formatFileSize(bytes: number) {
  let size = Math.max(0, bytes);
  let unit = 0;
  while (size >= 1024 && unit < SIZE_UNITS.length - 1) {
    size /= 1024;
    unit += 1;
  }
  const rounded = unit === 0 ? Math.round(size) : Math.round(size * 10) / 10;
  return `${rounded} ${SIZE_UNITS[unit]}`;
}

function fileTypeOf(name: string) {
  const dot = name.lastIndexOf('.');
  const extension = dot > 0 ? name.slice(dot + 1) : '';
  if (!extension || extension.length > MAX_EXTENSION_LENGTH) return '파일';
  return extension.toUpperCase();
}

export function fileMetaOf(name: string, size: number) {
  return `${fileTypeOf(name)} · ${formatFileSize(size)}`;
}

export function messagePreviewOf(message: ChatMessage) {
  if (message.content) return message.content;
  if (!message.attachment) return '첨부 파일';
  return isPreviewImage(message.attachment.mime) ? '사진' : '파일';
}
