import { api, ApiError, type Schemas } from '@/lib/api';
import type {
  ChatAdapter,
  ChatAttachment,
  ChatConversation,
  ChatConversationPort,
  ChatFriendPort,
  ChatFriendRequest,
  ChatMessage,
  ChatMessagePort,
  ChatRelationStatus,
  ChatTypingPort,
  ChatUser,
  ChatUserPort,
} from '@/types/chat';

const DM_PATH = '/api/v1/dm/conversations';
const ATTACHMENTS_PATH = '/api/v1/dm/attachments';
const PATH_CHECK_ORIGIN = 'https://path-check.invalid';
const FRIENDS_PATH = '/api/v1/friends';
const BLOCKS_PATH = '/api/v1/blocks';
const ME_PATH = '/api/v1/auth/me';
const USERS_PATH = '/api/v1/users';
const DEFAULT_PAGE_SIZE = 20;
const SEARCH_LIMIT = 20;

type DmMessage = Schemas['GlobalDmMessageResult'];
type DmConversation = Schemas['GlobalDmConversationResult'];
type DmAttachment = Schemas['DmAttachmentResult'];
type FriendUser = Schemas['FriendUserResult'];
type FriendRequest = Schemas['FriendRequestResult'];
type PublicUser = Schemas['PublicUserProfileResult'];
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

function toAttachment(item: DmAttachment | null | undefined): ChatAttachment | null {
  if (!item?.attachmentPath) return null;
  return {
    name: item.attachmentName || '첨부 파일',
    path: item.attachmentPath,
    mime: item.attachmentMime || 'application/octet-stream',
    size: item.attachmentSize ?? 0,
  };
}

function toMessage(item: DmMessage | null | undefined): ChatMessage | null {
  if (!item?.id || item.senderId === undefined || !item.createdAt) return null;
  const attachment = toAttachment(item);
  return {
    id: item.id,
    senderId: item.senderId,
    content: item.content ?? '',
    createdAt: item.createdAt,
    ...(attachment && { attachment }),
  };
}

function downloadPathOf(attachment: ChatAttachment) {
  const url = new URL(attachment.path, PATH_CHECK_ORIGIN);
  const isAttachmentPath =
    url.origin === PATH_CHECK_ORIGIN &&
    url.pathname.startsWith(`${ATTACHMENTS_PATH}/`) &&
    !url.search &&
    !url.hash;
  if (!isAttachmentPath) throw new Error('첨부 파일 주소가 올바르지 않습니다.');
  return url.pathname;
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

function toPublicUser(item: PublicUser | null | undefined): ChatUser | null {
  if (item?.id === undefined) return null;
  return { id: item.id, name: item.name ?? '', avatarUrl: item.avatarUrl ?? null };
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
    const pageIsFull = (items?.length ?? 0) >= size;
    if (pageIsFull && messages.length === 0) return invalidResponse();
    return { messages, olderCursor: pageIsFull ? messages[0].id : null };
  },

  async sendMessage(peerId, content) {
    const text = content.trim();
    if (!text) throw new ApiError('메시지를 입력해 주세요.', 400);
    const body: Schemas['SendFlexibleBody'] = { content: text };
    const item = await api.post<DmMessage>(`${DM_PATH}/${peerId}/messages`, body);
    return toMessage(item) ?? invalidResponse();
  },

  async uploadAttachment(file) {
    const form = new FormData();
    form.append('file', file);
    const item = await api.post<DmAttachment>(ATTACHMENTS_PATH, form);
    return toAttachment(item) ?? invalidResponse();
  },

  async sendAttachment(peerId, attachment) {
    const body: Schemas['SendFlexibleBody'] = {
      kind: attachment.mime.startsWith('image/') ? 'IMAGE' : 'FILE',
      attachmentName: attachment.name,
      attachmentPath: attachment.path,
      attachmentMime: attachment.mime,
      attachmentSize: attachment.size,
    };
    const item = await api.post<DmMessage>(`${DM_PATH}/${peerId}/messages`, body);
    return toMessage(item) ?? invalidResponse();
  },

  async downloadAttachment(peerId, attachment, signal) {
    return api.getBlob(downloadPathOf(attachment), { query: { peerUserId: peerId }, signal });
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

  async blockUser(userId) {
    const body: Schemas['BlockBody'] = { userId };
    await api.post(BLOCKS_PATH, body);
  },

  async unblockUser(userId) {
    await api.delete(`${BLOCKS_PATH}/${userId}`);
  },
};

const userPort: ChatUserPort = {
  async getMe(signal) {
    const me = await api.get<Schemas['AuthResponse']>(ME_PATH, { signal });
    if (me?.userId === undefined) return invalidResponse();
    return { id: me.userId, name: me.name ?? '', avatarUrl: me.avatarUrl ?? null };
  },

  async getUser(userId, signal) {
    const item = await api.get<PublicUser>(`${USERS_PATH}/${userId}`, { signal });
    return toPublicUser(item) ?? invalidResponse();
  },

  async searchUsers(query, signal) {
    const keyword = query.trim();
    if (!keyword) return [];
    const items = await api.get<PublicUser[]>(`${USERS_PATH}/search`, {
      query: { q: keyword, limit: SEARCH_LIMIT },
      signal,
    });
    return keepValid(items, toPublicUser);
  },
};

const typingPort: ChatTypingPort = {
  async sendTyping(peerId, typing) {
    const body: Schemas['TypingBody'] = { typing };
    await api.post(`${DM_PATH}/${peerId}/typing`, body);
  },
};

export const apiChatAdapter: ChatAdapter = {
  conversations: conversationPort,
  messages: messagePort,
  friends: friendPort,
  users: userPort,
  typing: typingPort,
};
