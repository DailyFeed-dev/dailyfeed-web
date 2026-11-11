import Link from 'next/link';
import type { ReactNode } from 'react';

import Button, { buttonClassName } from '@/components/common/Button';
import type { ChatUser } from '@/types/chat';

import ChatIconButton from './ChatIconButton';
import { formatRelativeTime } from './chatTime';
import FriendRow from './FriendRow';
import type { FriendsState } from './useFriends';
import { UNKNOWN_USER_NAME } from './useChatPeer';

type FriendsPanelProps = {
  friendsState: FriendsState;
  query: string;
};

type FriendSectionProps = {
  title: string;
  count: number;
  children: ReactNode;
};

function FriendSection({ title, count, children }: FriendSectionProps) {
  return (
    <section aria-label={title}>
      <h2 className="flex gap-1.5 pt-3 pb-1 pl-1 text-[13px] leading-[1.45] font-semibold">
        <span className="text-(--color-text-muted)">{title}</span>
        <span className="text-(--color-bg-brand)">{count}</span>
      </h2>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </section>
  );
}

function nameMatches(user: ChatUser, query: string) {
  const keyword = query.trim().toLowerCase();
  return !keyword || user.name.toLowerCase().includes(keyword);
}

function displayName(user: ChatUser) {
  return user.name || UNKNOWN_USER_NAME;
}

export default function FriendsPanel({ friendsState, query }: FriendsPanelProps) {
  const receivedRequests = friendsState.receivedRequests.filter((request) =>
    nameMatches(request.user, query),
  );
  const sentRequests = friendsState.sentRequests.filter((request) =>
    nameMatches(request.user, query),
  );
  const friends = friendsState.friends.filter((user) => nameMatches(user, query));
  const isBusy = (user: ChatUser) => friendsState.busyUserIds.includes(user.id);

  if (!friendsState.loaded) {
    return <p className="p-3 text-sm text-(--color-text-muted)">불러오는 중...</p>;
  }

  if (friendsState.loadError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 p-3">
        <p className="text-sm text-(--color-text-danger)">{friendsState.loadError}</p>
        <Button variant="outline" onClick={() => void friendsState.reload()}>
          다시 불러오기
        </Button>
      </div>
    );
  }

  return (
    <div className="-mx-1 flex min-h-0 flex-1 flex-col overflow-y-auto px-1">
      {friendsState.actionError && (
        <p role="alert" className="px-1 pt-2 text-[13px] text-(--color-text-danger)">
          {friendsState.actionError}
        </p>
      )}

      {receivedRequests.length > 0 && (
        <FriendSection title="받은 요청" count={receivedRequests.length}>
          {receivedRequests.map(({ user, createdAt }) => (
            <li key={user.id}>
              <FriendRow user={user} subtitle={formatRelativeTime(createdAt)}>
                <ChatIconButton
                  icon="check"
                  tone="brand"
                  label={`${displayName(user)}님의 친구 요청 수락`}
                  disabled={isBusy(user)}
                  onClick={() => void friendsState.accept(user.id)}
                />
                <ChatIconButton
                  icon="close"
                  tone="outline"
                  label={`${displayName(user)}님의 친구 요청 거절`}
                  disabled={isBusy(user)}
                  onClick={() => void friendsState.reject(user.id)}
                />
              </FriendRow>
            </li>
          ))}
        </FriendSection>
      )}

      {sentRequests.length > 0 && (
        <FriendSection title="보낸 요청" count={sentRequests.length}>
          {sentRequests.map(({ user }) => (
            <li key={user.id}>
              <FriendRow user={user} subtitle="수락을 기다리는 중">
                <Button
                  variant="outline"
                  aria-label={`${displayName(user)}님에게 보낸 친구 요청 취소`}
                  disabled={isBusy(user)}
                  onClick={() => void friendsState.cancel(user.id)}
                >
                  요청 취소
                </Button>
              </FriendRow>
            </li>
          ))}
        </FriendSection>
      )}

      <FriendSection title="친구" count={friends.length}>
        {friends.length === 0 && (
          <li className="p-3 text-sm text-(--color-text-muted)">
            {query.trim() ? '검색 결과가 없어요.' : '아직 친구가 없어요.'}
          </li>
        )}
        {friends.map((user) => (
          <li key={user.id}>
            <FriendRow user={user}>
              <Link
                href={`/chat?with=${user.id}`}
                scroll={false}
                aria-label={`${displayName(user)}님과 채팅`}
                className={buttonClassName({ variant: 'soft' })}
              >
                채팅
              </Link>
            </FriendRow>
          </li>
        ))}
      </FriendSection>
    </div>
  );
}
