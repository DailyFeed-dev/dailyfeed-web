'use client';

import { useRef, useState } from 'react';

import Button from '@/components/common/Button';
import { ApiError } from '@/lib/api';
import type { ChatUser, ChatUserId } from '@/types/chat';

import ChatRoomHeader from './ChatRoomHeader';
import { MessageSkeletonList } from './ChatSkeletons';
import ChatStateMessage, { ChatStateIcon } from './ChatStateMessage';
import { buildTimeline } from './chatTimeline';
import FirstChatIntro from './FirstChatIntro';
import MessageComposer from './MessageComposer';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';
import { useChatPeer } from './useChatPeer';
import { useChatRoom } from './useChatRoom';
import { peerListStatusOf, useFriendRelation } from './useFriendRelation';
import type { FriendsState } from './useFriends';
import { usePeerTyping, useTypingSender } from './useTyping';

type ChatRoomProps = {
  peerId: ChatUserId;
  knownPeer: ChatUser | undefined;
  friendsState: FriendsState;
};

function errorCodeOf(error: unknown) {
  if (!(error instanceof ApiError)) return undefined;
  return `오류 코드: ${error.code ?? error.status}`;
}

export default function ChatRoom({ peerId, knownPeer, friendsState }: ChatRoomProps) {
  const { peer, loading: peerLoading } = useChatPeer(peerId, knownPeer);
  const room = useChatRoom(peerId);
  const relationState = useFriendRelation(
    peerId,
    peerListStatusOf(friendsState, peerId),
    friendsState.reload,
  );
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const items = buildTimeline(room.messages, room.pending, peerId);
  const canDm = relationState.relation?.canDm !== false;
  const isFirstChat = room.status === 'ready' && items.length === 0 && !room.hasOlder;
  const peerTyping = usePeerTyping(peerId);
  const typingSender = useTypingSender(peerId, canDm);

  const changeDraft = (text: string) => {
    setDraft(text);
    typingSender.onDraftChange(text);
  };

  const sendMessage = (text: string) => {
    typingSender.stopTyping();
    room.send(text);
  };

  const pickReply = (text: string) => {
    changeDraft(text);
    inputRef.current?.focus();
  };

  return (
    <section
      aria-label={peerLoading ? '대화' : `${peer.name}님과의 대화`}
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-(--color-bg-surface)"
    >
      <ChatRoomHeader peer={peer} peerLoading={peerLoading} relationState={relationState} />

      {room.status === 'loading' && <MessageSkeletonList />}
      {room.status === 'error' && (
        <div
          role="alert"
          className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-[#fcfcfe] px-4 py-5"
        >
          <ChatStateMessage
            visual={<ChatStateIcon name="warning" tone="danger" />}
            title="메시지를 불러오지 못했어요"
            description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
            detail={errorCodeOf(room.syncError)}
          >
            <Button size="md" icon="refresh" onClick={room.retryLoad}>
              다시 시도
            </Button>
          </ChatStateMessage>
        </div>
      )}
      {isFirstChat &&
        (peerLoading ? (
          <div className="flex-1 bg-[#fcfcfe]" />
        ) : (
          <FirstChatIntro peer={peer} onPickReply={canDm ? pickReply : undefined} />
        ))}
      {room.status === 'ready' && !isFirstChat && (
        <MessageList
          items={items}
          peer={peer}
          hasOlder={room.hasOlder}
          loadingOlder={room.loadingOlder}
          olderError={room.olderError}
          onLoadOlder={room.loadOlder}
          onRetry={room.retry}
          onDiscard={room.discard}
        />
      )}

      {room.status === 'ready' && <TypingIndicator name={peer.name} typing={peerTyping} />}

      <MessageComposer
        value={draft}
        onValueChange={changeDraft}
        onSend={sendMessage}
        onAttach={room.attach}
        disabled={room.status !== 'ready' || !canDm}
        placeholder={canDm ? undefined : '메시지를 보낼 수 없어요'}
        inputRef={inputRef}
      />
    </section>
  );
}
