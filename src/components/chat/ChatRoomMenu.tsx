'use client';

import { useEffect, useRef, useState } from 'react';

import Modal from '@/components/common/Modal';
import SubMenu, { type SubMenuItem } from '@/components/common/SubMenu';

import ChatIconButton from './ChatIconButton';
import type { FriendRelationState } from './useFriendRelation';

type ChatRoomMenuProps = {
  peerName: string;
  relationState: FriendRelationState;
};

type ConfirmAction = 'removeFriend' | 'block';

export default function ChatRoomMenu({ peerName, relationState }: ChatRoomMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { relation, busy } = relationState;

  useEffect(() => {
    if (!open) return;
    containerRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  if (!relation) return null;

  const askToConfirm = (action: ConfirmAction) => {
    setOpen(false);
    setConfirmAction(action);
  };

  const unblock = () => {
    setOpen(false);
    void relationState.unblock();
  };

  const runConfirmedAction = () => {
    const action = confirmAction;
    setConfirmAction(null);
    if (action === 'removeFriend') void relationState.removeFriend();
    if (action === 'block') void relationState.block();
  };

  const items: SubMenuItem[] = [];
  if (relation.status === 'friend') {
    items.push({ label: '친구 삭제', onClick: () => askToConfirm('removeFriend') });
  }
  if (relation.status === 'blockedByMe') {
    items.push({ label: '차단 해제', onClick: unblock });
  } else {
    items.push({ label: '차단하기', tone: 'danger', onClick: () => askToConfirm('block') });
  }

  return (
    <div ref={containerRef} className="relative">
      <ChatIconButton
        ref={buttonRef}
        icon="more-vertical"
        label="대화 메뉴"
        tone="outline"
        size="md"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={busy}
        onClick={() => setOpen((current) => !current)}
      />
      {open && <SubMenu items={items} className="absolute top-full right-0 z-20 mt-2 min-w-36" />}
      <Modal
        open={confirmAction === 'removeFriend'}
        title={`${peerName}님을 친구에서 삭제할까요?`}
        body="다시 친구가 되려면 친구 요청을 보내야 해요."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={runConfirmedAction}
        onCancel={() => setConfirmAction(null)}
      />
      <Modal
        open={confirmAction === 'block'}
        title={`${peerName}님을 차단할까요?`}
        body={'차단하면 서로 메시지를 보낼 수 없어요.\n차단은 이 메뉴에서 언제든 풀 수 있어요.'}
        confirmLabel="차단"
        cancelLabel="취소"
        onConfirm={runConfirmedAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
