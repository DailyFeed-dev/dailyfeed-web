'use client';

import Image from 'next/image';

import type { ChatAttachment, ChatUserId } from '@/types/chat';

import AttachmentCard from './AttachmentCard';
import { fileMetaOf, isPreviewImage } from './chatAttachment';
import { useAttachmentDownload, useAttachmentImage } from './useAttachment';

type MessageAttachmentProps = {
  peerId: ChatUserId;
  attachment: ChatAttachment;
};

const IMAGE_BOX = 'h-[180px] w-[240px] max-w-full rounded-2xl bg-(--color-bg-subtle)';

function AttachmentImage({ peerId, attachment }: MessageAttachmentProps) {
  const { url, failed, retry } = useAttachmentImage(peerId, attachment);

  if (failed) {
    return (
      <div
        role="alert"
        className={`${IMAGE_BOX} flex flex-col items-center justify-center gap-1.5 text-xs leading-[1.45] text-(--color-text-secondary)`}
      >
        <span>사진을 불러오지 못했어요</span>
        <button
          type="button"
          onClick={retry}
          className="cursor-pointer font-semibold underline underline-offset-2"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!url) {
    return (
      <div
        role="img"
        aria-label={`${attachment.name} 불러오는 중`}
        className={`${IMAGE_BOX} animate-pulse`}
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="원본 보기"
      className={`${IMAGE_BOX} relative block overflow-hidden`}
    >
      <Image src={url} alt={attachment.name} fill sizes="240px" className="object-cover" />
    </a>
  );
}

function downloadMetaOf(status: ReturnType<typeof useAttachmentDownload>['status'], meta: string) {
  if (status === 'downloading') return '내려받는 중...';
  if (status === 'failed') return '내려받지 못했어요. 다시 눌러 주세요.';
  return meta;
}

function AttachmentFile({ peerId, attachment }: MessageAttachmentProps) {
  const { status, download } = useAttachmentDownload(peerId, attachment);

  return (
    <AttachmentCard
      name={attachment.name}
      meta={downloadMetaOf(status, fileMetaOf(attachment.name, attachment.size))}
      metaTone={status === 'failed' ? 'danger' : 'default'}
      actionLabel="내려받기"
      onClick={() => void download()}
    />
  );
}

export default function MessageAttachment({ peerId, attachment }: MessageAttachmentProps) {
  if (isPreviewImage(attachment.mime)) {
    return <AttachmentImage peerId={peerId} attachment={attachment} />;
  }
  return <AttachmentFile peerId={peerId} attachment={attachment} />;
}
