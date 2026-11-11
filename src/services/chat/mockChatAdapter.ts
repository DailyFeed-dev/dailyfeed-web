import { ApiError } from '@/lib/api';
import type {
  ChatAdapter,
  ChatConversation,
  ChatConversationPort,
  ChatFriendPort,
  ChatFriendRequest,
  ChatMessage,
  ChatMessagePort,
  ChatRelation,
  ChatUser,
  ChatUserId,
} from '@/types/chat';

const ME: ChatUserId = 1;
const MOCK_DELAY_MS = 200;
const AUTO_REPLY_DELAY_MS = 1500;
const DEFAULT_PAGE_SIZE = 20;
const MINUTE_MS = 60_000;

type FriendRequestRecord = {
  id: string;
  fromId: ChatUserId;
  toId: ChatUserId;
  createdAt: string;
};

let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${++sequence}`;
const now = () => new Date().toISOString();
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * MINUTE_MS).toISOString();

const seedMessage = (senderId: ChatUserId, content: string, minutes: number): ChatMessage => ({
  id: nextId('m'),
  senderId,
  content,
  createdAt: minutesAgo(minutes),
});

const users = new Map<ChatUserId, ChatUser>(
  [
    { id: 2, name: '김민지', avatarUrl: null },
    { id: 3, name: '이준호', avatarUrl: null },
    { id: 4, name: '박서연', avatarUrl: null },
    { id: 5, name: '최도윤', avatarUrl: null },
    { id: 6, name: '정하은', avatarUrl: null },
  ].map((user) => [user.id, user]),
);

const minjiThread = [
  ...Array.from({ length: 30 }, (_, index) =>
    seedMessage(index % 2 === 0 ? 2 : ME, `이전 대화 ${index + 1}`, 600 - index * 10),
  ),
  seedMessage(2, '로그인 API 연결 끝났어요 🎉', 5),
  seedMessage(2, '채팅 화면은 어디까지 됐어요?', 3),
];
const junhoThread = [
  seedMessage(ME, '내일 회의 몇 시예요?', 90),
  seedMessage(3, '오후 2시예요!', 60),
];
const seoyeonThread = [seedMessage(4, '안녕하세요, 게시글 보고 연락드려요.', 30)];

const threads = new Map<ChatUserId, ChatMessage[]>([
  [2, minjiThread],
  [3, junhoThread],
  [4, seoyeonThread],
]);

const lastReadIds = new Map<ChatUserId, string>([
  [2, minjiThread[29].id],
  [3, junhoThread[0].id],
]);

const friendIds = new Set<ChatUserId>([2, 3]);

let friendRequests: FriendRequestRecord[] = [
  { id: nextId('fr'), fromId: 4, toId: ME, createdAt: minutesAgo(120) },
  { id: nextId('fr'), fromId: ME, toId: 5, createdAt: minutesAgo(240) },
];

function wait(signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    signal?.throwIfAborted();
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, MOCK_DELAY_MS);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function requireUser(userId: ChatUserId): ChatUser {
  const user = users.get(userId);
  if (!user) throw new ApiError('사용자를 찾을 수 없습니다.', 404);
  return { ...user };
}

function requirePeer(userId: ChatUserId): ChatUser {
  if (userId === ME) throw new ApiError('나와는 채팅할 수 없습니다.', 400);
  return requireUser(userId);
}

function appendMessage(peerId: ChatUserId, message: ChatMessage) {
  threads.set(peerId, [...(threads.get(peerId) ?? []), message]);
}

function readIndexOf(peerId: ChatUserId, thread: ChatMessage[]) {
  return thread.findIndex(({ id }) => id === lastReadIds.get(peerId));
}

function unreadCountOf(peerId: ChatUserId, thread: ChatMessage[]) {
  return thread
    .slice(readIndexOf(peerId, thread) + 1)
    .filter((message) => message.senderId === peerId).length;
}

function toConversation(peerId: ChatUserId, thread: ChatMessage[]): ChatConversation {
  const last = thread[thread.length - 1];
  return {
    peer: requireUser(peerId),
    lastMessage: last ? { ...last } : null,
    unreadCount: unreadCountOf(peerId, thread),
  };
}

function latestFirst(a: ChatConversation, b: ChatConversation) {
  const timeOf = (conversation: ChatConversation) =>
    conversation.lastMessage ? Date.parse(conversation.lastMessage.createdAt) : 0;
  return timeOf(b) - timeOf(a);
}

function scheduleAutoReply(peerId: ChatUserId) {
  setTimeout(() => {
    appendMessage(peerId, {
      id: nextId('m'),
      senderId: peerId,
      content: '메시지 확인했어요!',
      createdAt: now(),
    });
  }, AUTO_REPLY_DELAY_MS);
}

function requestBetween(userId: ChatUserId) {
  return friendRequests.find(
    (request) =>
      (request.fromId === ME && request.toId === userId) ||
      (request.fromId === userId && request.toId === ME),
  );
}

function takeRequest(requestId: string, side: 'sent' | 'received') {
  const request = friendRequests.find(
    (item) => item.id === requestId && (side === 'sent' ? item.fromId : item.toId) === ME,
  );
  if (!request) throw new ApiError('친구 요청을 찾을 수 없습니다.', 404);
  friendRequests = friendRequests.filter((item) => item.id !== requestId);
  return request;
}

function toFriendRequest(request: FriendRequestRecord, otherId: ChatUserId): ChatFriendRequest {
  return { id: request.id, user: requireUser(otherId), createdAt: request.createdAt };
}

const newestFirst = (a: { createdAt: string }, b: { createdAt: string }) =>
  Date.parse(b.createdAt) - Date.parse(a.createdAt);

const conversationPort: ChatConversationPort = {
  async listConversations(signal) {
    await wait(signal);
    return [...threads.entries()]
      .filter(([, thread]) => thread.length > 0)
      .map(([peerId, thread]) => toConversation(peerId, thread))
      .sort(latestFirst);
  },

  async markConversationRead(peerId, lastReadMessageId) {
    await wait();
    requirePeer(peerId);
    const thread = threads.get(peerId) ?? [];
    const nextIndex = thread.findIndex(({ id }) => id === lastReadMessageId);
    if (nextIndex === -1) throw new ApiError('메시지를 찾을 수 없습니다.', 404);
    if (nextIndex > readIndexOf(peerId, thread)) lastReadIds.set(peerId, lastReadMessageId);
  },
};

const messagePort: ChatMessagePort = {
  async listMessages(peerId, { before, limit = DEFAULT_PAGE_SIZE, signal } = {}) {
    await wait(signal);
    requirePeer(peerId);
    const thread = threads.get(peerId) ?? [];
    const end = before === undefined ? thread.length : thread.findIndex(({ id }) => id === before);
    if (end === -1) throw new ApiError('이전 메시지를 찾을 수 없습니다.', 400);
    const start = Math.max(0, end - (limit > 0 ? limit : DEFAULT_PAGE_SIZE));
    return {
      messages: thread.slice(start, end).map((message) => ({ ...message })),
      olderCursor: start > 0 ? thread[start].id : null,
    };
  },

  async sendMessage(peerId, content) {
    await wait();
    requirePeer(peerId);
    const text = content.trim();
    if (!text) throw new ApiError('메시지를 입력해 주세요.', 400);
    const message: ChatMessage = { id: nextId('m'), senderId: ME, content: text, createdAt: now() };
    appendMessage(peerId, message);
    lastReadIds.set(peerId, message.id);
    scheduleAutoReply(peerId);
    return { ...message };
  },
};

const friendPort: ChatFriendPort = {
  async getRelation(userId, signal) {
    await wait(signal);
    const user = requirePeer(userId);
    if (friendIds.has(userId)) return { user, status: 'friend', requestId: null };
    const request = requestBetween(userId);
    if (!request) return { user, status: 'none', requestId: null };
    const status: ChatRelation['status'] = request.fromId === ME ? 'sent' : 'received';
    return { user, status, requestId: request.id };
  },

  async listFriends(signal) {
    await wait(signal);
    return [...friendIds].map(requireUser).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  },

  async listFriendRequests(signal) {
    await wait(signal);
    return {
      received: friendRequests
        .filter((request) => request.toId === ME)
        .map((request) => toFriendRequest(request, request.fromId))
        .sort(newestFirst),
      sent: friendRequests
        .filter((request) => request.fromId === ME)
        .map((request) => toFriendRequest(request, request.toId))
        .sort(newestFirst),
    };
  },

  async sendFriendRequest(userId) {
    await wait();
    requirePeer(userId);
    if (friendIds.has(userId)) throw new ApiError('이미 친구입니다.', 409);
    if (requestBetween(userId)) throw new ApiError('이미 친구 요청이 있습니다.', 409);
    const request: FriendRequestRecord = {
      id: nextId('fr'),
      fromId: ME,
      toId: userId,
      createdAt: now(),
    };
    friendRequests = [...friendRequests, request];
    return toFriendRequest(request, userId);
  },

  async cancelFriendRequest(requestId) {
    await wait();
    takeRequest(requestId, 'sent');
  },

  async acceptFriendRequest(requestId) {
    await wait();
    const request = takeRequest(requestId, 'received');
    friendIds.add(request.fromId);
  },

  async rejectFriendRequest(requestId) {
    await wait();
    takeRequest(requestId, 'received');
  },

  async removeFriend(userId) {
    await wait();
    if (!friendIds.delete(userId)) throw new ApiError('친구 목록에 없는 사용자입니다.', 404);
  },
};

export const mockChatAdapter: ChatAdapter = {
  conversations: conversationPort,
  messages: messagePort,
  friends: friendPort,
};
