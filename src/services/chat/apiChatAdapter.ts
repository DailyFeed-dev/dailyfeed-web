import { api, ApiError, type Schemas } from '@/lib/api';
import type {
  ChatAdapter,
  ChatConversation,
  ChatConversationPort,
  ChatFriendPort,
  ChatFriendRequest,
  ChatMessage,
  ChatMessagePort,
  ChatRelationStatus,
  ChatUser,
  ChatUserPort,
} from '@/types/chat';

const DM_PATH = '/api/v1/dm/conversations';
const FRIENDS_PATH = '/api/v1/friends';
const DEFAULT_PAGE_SIZE = 20;

type DmMessage = Schemas['GlobalDmMessageResult'];
type DmConversation = Schemas['GlobalDmConversationResult'];
type FriendUser = Schemas['FriendUserResult'];
type FriendRequest = Schemas['FriendRequestResult'];
type Relationship = NonNullable<Schemas['RelationshipResult']['relationship']>;

const relationStatuses: Record<Relationship, ChatRelationStatus> = {
  NONE: 'none',
  OUTGOING_REQUEST: 'sent',
  INCOMING_REQUEST: 'received',
  FRIENDS: 'friend',
  BLOCKED_BY_ME: 'blockedByMe',
  BLOCKED_ME: 'blockedMe',
};

const oldestFirst = (a: ChatMessage, b: ChatMessage) =>
  Date.parse(a.createdAt) - Date.parse(b.createdAt);

const newestFirst = (a: { createdAt: string }, b: { createdAt: string }) =>
  Date.parse(b.createdAt) - Date.parse(a.createdAt);

const timeOfLastMessage = (conversation: ChatConversation) =>
  conversation.lastMessage ? Date.parse(conversation.lastMessage.createdAt) : 0;

function toMessage(item: DmMessage): ChatMessage | null {
  if (!item.id || item.senderId === undefined || !item.createdAt) return null;
  return {
    id: item.id,
    senderId: item.senderId,
    content: item.content ?? '',
    createdAt: item.createdAt,
  };
}

function toConversation(item: DmConversation): ChatConversation | null {
  const { peerUserId, lastMessageId, lastSenderId, lastMessageAt } = item;
  if (peerUserId === undefined) return null;
  const lastMessage =
    lastMessageId && lastSenderId !== undefined && lastMessageAt
      ? {
          id: lastMessageId,
          senderId: lastSenderId,
          content: item.lastMessagePreview ?? '',
          createdAt: lastMessageAt,
        }
      : null;
  return {
    peer: { id: peerUserId, name: item.peerName ?? '', avatarUrl: item.peerAvatarUrl ?? null },
    lastMessage,
    unreadCount: item.unreadCount ?? 0,
  };
}

function toFriend(item: FriendUser): ChatUser | null {
  if (item.userId === undefined) return null;
  return { id: item.userId, name: item.name ?? '', avatarUrl: item.avatarUrl ?? null };
}

function toFriendRequest(item: FriendRequest, side: 'sent' | 'received'): ChatFriendRequest | null {
  const id = side === 'received' ? item.requesterId : item.addresseeId;
  const name = side === 'received' ? item.requesterName : item.addresseeName;
  const avatarUrl = side === 'received' ? item.requesterAvatarUrl : item.addresseeAvatarUrl;
  if (id === undefined || !item.createdAt) return null;
  return {
    user: { id, name: name ?? '', avatarUrl: avatarUrl ?? null },
    createdAt: item.createdAt,
  };
}

function keepValid<T, R>(items: T[] | null | undefined, convert: (item: T) => R | null): R[] {
  return (items ?? []).flatMap((item) => {
    const converted = convert(item);
    return converted ? [converted] : [];
  });
}

function invalidResponse(): never {
  throw new Error('서버 응답 형식이 올바르지 않습니다.');
}

const conversationPort: ChatConversationPort = {
  async listConversations(signal) {
    const items = await api.get<DmConversation[]>(DM_PATH, { signal });
    return keepValid(items, toConversation).sort(
      (a, b) => timeOfLastMessage(b) - timeOfLastMessage(a),
    );
  },

  async markConversationRead(peerId, lastReadMessageId) {
    const body: Schemas['ReadBody'] = { messageId: lastReadMessageId };
    await api.post(`${DM_PATH}/${peerId}/read`, body);
  },
};

const messagePort: ChatMessagePort = {
  async listMessages(peerId, { before, limit = DEFAULT_PAGE_SIZE, signal } = {}) {
    const size = limit > 0 ? limit : DEFAULT_PAGE_SIZE;
    const items = await api.get<DmMessage[]>(`${DM_PATH}/${peerId}/messages`, {
      query: { limit: size, before },
      signal,
    });
    const messages = keepValid(items, toMessage).sort(oldestFirst);
    const hasMore = (items?.length ?? 0) >= size && messages.length > 0;
    return { messages, olderCursor: hasMore ? messages[0].id : null };
  },

  async sendMessage(peerId, content) {
    const text = content.trim();
    if (!text) throw new ApiError('메시지를 입력해 주세요.', 400);
    const body: Schemas['SendFlexibleBody'] = { content: text };
    const item = await api.post<DmMessage>(`${DM_PATH}/${peerId}/messages`, body);
    return toMessage(item) ?? invalidResponse();
  },
};

const friendPort: ChatFriendPort = {
  async getRelation(userId, signal) {
    const item = await api.get<Schemas['RelationshipResult']>(
      `${FRIENDS_PATH}/relationship/${userId}`,
      { signal },
    );
    if (!item?.relationship) return invalidResponse();
    return { userId, status: relationStatuses[item.relationship], canDm: item.canDm === true };
  },

  async listFriends(signal) {
    const items = await api.get<FriendUser[]>(FRIENDS_PATH, { signal });
    return keepValid(items, toFriend).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  },

  async listFriendRequests(signal) {
    const [incoming, outgoing] = await Promise.all([
      api.get<FriendRequest[]>(`${FRIENDS_PATH}/requests/incoming`, { signal }),
      api.get<FriendRequest[]>(`${FRIENDS_PATH}/requests/outgoing`, { signal }),
    ]);
    return {
      received: keepValid(incoming, (item) => toFriendRequest(item, 'received')).sort(newestFirst),
      sent: keepValid(outgoing, (item) => toFriendRequest(item, 'sent')).sort(newestFirst),
    };
  },

  async sendFriendRequest(userId) {
    const body: Schemas['TargetUserBody'] = { userId };
    await api.post(`${FRIENDS_PATH}/requests`, body);
  },

  async cancelFriendRequest(userId) {
    await api.delete(`${FRIENDS_PATH}/requests/${userId}`);
  },

  async acceptFriendRequest(userId) {
    await api.post(`${FRIENDS_PATH}/requests/${userId}/accept`);
  },

  async rejectFriendRequest(userId) {
    await api.post(`${FRIENDS_PATH}/requests/${userId}/reject`);
  },

  async removeFriend(userId) {
    await api.delete(`${FRIENDS_PATH}/${userId}`);
  },
};

const userPort: ChatUserPort = {
  async getUser() {
    throw new ApiError('사용자 조회 API가 아직 준비되지 않았습니다.', 501);
  },
};

export const apiChatAdapter: ChatAdapter = {
  conversations: conversationPort,
  messages: messagePort,
  friends: friendPort,
  users: userPort,
};
