'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';

import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import Search from '@/components/common/Search';
import type { ChatUserId } from '@/types/chat';

import ChatAvatar from './ChatAvatar';
import { matchesQuery } from './chatSearch';
import { ChatListSkeleton } from './ChatSkeletons';
import { UNKNOWN_USER_NAME } from './useChatPeer';
import type { FriendsState } from './useFriends';

type NewChatDialogProps = {
  friendsState: FriendsState;
  onClose: () => void;
};

const TITLE_ID = 'new-chat-dialog-title';

export default function NewChatDialog({ friendsState, onClose }: NewChatDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<ChatUserId | null>(null);

  const friends = friendsState.friends.filter((user) => matchesQuery(query, user.name));
  const selected = friendsState.friends.find((user) => user.id === selectedId) ?? null;
  const selectedName = selected ? selected.name || UNKNOWN_USER_NAME : null;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = () => dialogRef.current?.close();

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  const startChat = (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    router.push(`/chat?with=${selected.id}`, { scroll: false });
    close();
  };

  const renderFriends = () => {
    if (!friendsState.loaded) return <ChatListSkeleton label="친구 목록을 불러오는 중" />;
    if (friendsState.loadError) {
      return (
        <div role="alert" className="flex flex-col items-start gap-2 p-3">
          <p className="text-sm text-(--color-text-danger)">{friendsState.loadError}</p>
          <Button variant="outline" icon="refresh" onClick={() => void friendsState.reload()}>
            다시 시도
          </Button>
        </div>
      );
    }
    if (friends.length === 0) {
      return (
        <p className="p-3 text-sm text-(--color-text-muted)">
          {query.trim() ? '검색 결과가 없어요.' : '아직 친구가 없어요.'}
        </p>
      );
    }
    return friends.map((user) => {
      const name = user.name || UNKNOWN_USER_NAME;
      const checked = user.id === selectedId;
      return (
        <label
          key={user.id}
          className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${checked ? 'bg-(--color-bg-brand-soft)' : 'hover:bg-(--color-bg-subtle)'}`}
        >
          <ChatAvatar name={name} src={user.avatarUrl} size={40} />
          <span className="min-w-0 flex-1 truncate text-[15px] leading-[1.45] font-semibold text-(--color-text-primary)">
            {name}
          </span>
          <input
            type="radio"
            name="new-chat-friend"
            value={user.id}
            checked={checked}
            onChange={() => setSelectedId(user.id)}
            className="size-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-(--color-border-strong) bg-(--color-bg-surface) checked:border-6 checked:border-(--color-bg-brand) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand)"
          />
        </label>
      );
    });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      onClose={onClose}
      onClick={closeOnBackdrop}
      className="m-auto w-[calc(100%-2rem)] max-w-[480px] rounded-[20px] bg-(--color-bg-surface) p-0 shadow-[0px_16px_40px_0px_rgba(31,28,51,0.18)] backdrop:bg-[rgba(31,29,43,0.45)]"
    >
      <form
        onSubmit={startChat}
        className="flex max-h-[min(640px,calc(100dvh-4rem))] flex-col gap-4 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.45]">
            <h2 id={TITLE_ID} className="text-xl font-bold text-(--color-text-primary)">
              새 채팅
            </h2>
            <p className="text-[13px] text-(--color-text-secondary)">친구와 1:1 대화를 시작해요</p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={close}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--color-bg-subtle) text-(--color-text-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-brand)"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <Search
          placeholder="친구 이름으로 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <p className="text-[13px] leading-[1.45] font-semibold text-(--color-text-secondary)">
          친구 {friendsState.friends.length}명
        </p>

        <div
          role="radiogroup"
          aria-label="대화할 친구"
          className="-mx-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-1"
        >
          {renderFriends()}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="md" onClick={close}>
            취소
          </Button>
          <Button type="submit" size="md" disabled={!selected}>
            {selectedName ? `${selectedName}님과 채팅 시작` : '채팅 시작'}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
