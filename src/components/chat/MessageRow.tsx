import type { ChatMessage, ChatUser } from '@/types/chat';

import AttachmentCard from './AttachmentCard';
import ChatAvatar from './ChatAvatar';
import { fileMetaOf, isTooLargeToSend } from './chatAttachment';
import { formatMessageTime } from './chatTime';
import type { TimelineItem } from './chatTimeline';
import MessageAttachment from './MessageAttachment';

type MessageRowProps = {
  item: TimelineItem;
  peer: ChatUser;
  onRetry: (clientId: string) => void;
  onDiscard: (clientId: string) => void;
};

const BUBBLE_TEXT = 'text-sm leading-[1.45] break-words whitespace-pre-wrap';
const INCOMING_BUBBLE = `max-w-[440px] rounded-[4px_16px_16px_16px] bg-(--color-bg-subtle) px-4 py-2.5 text-(--color-text-primary) ${BUBBLE_TEXT}`;
const OUTGOING_BUBBLE = `max-w-[440px] rounded-[16px_4px_16px_16px] bg-(--color-bg-brand) px-4 py-2.5 text-(--color-text-on-brand) ${BUBBLE_TEXT}`;
const META = 'flex items-center gap-1.5 text-xs leading-[1.45]';

const showsText = (message: ChatMessage) => message.content !== '' || !message.attachment;

export default function MessageRow({ item, peer, onRetry, onDiscard }: MessageRowProps) {
  if (item.kind === 'divider') {
    return (
      <div className="flex justify-center">
        <span className="rounded-xl bg-(--color-bg-subtle) px-3 py-1 text-xs leading-[1.45] font-medium text-(--color-text-secondary)">
          {item.label}
        </span>
      </div>
    );
  }

  if (item.kind === 'incoming') {
    const { message, showHead } = item;
    return (
      <div className={`flex items-start gap-2.5 ${showHead ? '' : 'pl-[46px]'}`}>
        {showHead && <ChatAvatar name={peer.name} src={peer.avatarUrl} size={36} />}
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          {showHead && (
            <div className="flex items-center gap-2 leading-[1.45]">
              <span className="text-[13px] font-semibold text-(--color-text-primary)">
                {peer.name}
              </span>
              <time dateTime={message.createdAt} className="text-xs text-(--color-text-muted)">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
          )}
          {message.attachment && (
            <MessageAttachment peerId={peer.id} attachment={message.attachment} />
          )}
          {showsText(message) && <p className={INCOMING_BUBBLE}>{message.content}</p>}
        </div>
      </div>
    );
  }

  if (item.kind === 'outgoing') {
    const { message } = item;
    return (
      <div className="flex flex-col items-end gap-1.5">
        {message.attachment && (
          <MessageAttachment peerId={peer.id} attachment={message.attachment} />
        )}
        {showsText(message) && <p className={OUTGOING_BUBBLE}>{message.content}</p>}
        <time dateTime={message.createdAt} className={`${META} text-(--color-text-muted)`}>
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
    );
  }

  const { message } = item;
  const failed = message.status === 'failed';
  const dimmed = failed ? '' : 'opacity-60';
  const canRetry = !message.file || !isTooLargeToSend(message.file);
  return (
    <div className="flex flex-col items-end gap-1.5">
      {message.file ? (
        <AttachmentCard
          name={message.file.name}
          meta={fileMetaOf(message.file.name, message.file.size)}
          className={dimmed}
        />
      ) : (
        <p className={`${OUTGOING_BUBBLE} ${dimmed}`}>{message.content}</p>
      )}
      {failed ? (
        <div className={`${META} text-(--color-text-danger)`} role="alert">
          <span>{message.errorMessage}</span>
          {canRetry && (
            <button
              type="button"
              onClick={() => onRetry(message.clientId)}
              className="cursor-pointer font-semibold underline underline-offset-2"
            >
              다시 보내기
            </button>
          )}
          <button
            type="button"
            onClick={() => onDiscard(message.clientId)}
            className="cursor-pointer text-(--color-text-muted) underline underline-offset-2"
          >
            삭제
          </button>
        </div>
      ) : (
        <span className={`${META} text-(--color-text-muted)`}>전송 중</span>
      )}
    </div>
  );
}
