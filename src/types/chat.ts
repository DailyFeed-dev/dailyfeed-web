export type ChatUserId = number;

export type ChatUser = {
  id: ChatUserId;
  name: string;
  avatarUrl: string | null;
};

export type ChatMessage = {
  id: string;
  senderId: ChatUserId;
  content: string;
  createdAt: string;
};

export type ChatConversation = {
  peer: ChatUser;
  lastMessage: ChatMessage | null;
  unreadCount: number;
};

export type ChatMessagePageRequest = {
  before?: string;
  limit?: number;
  signal?: AbortSignal;
};

export type ChatMessagePage = {
  messages: ChatMessage[];
  olderCursor: string | null;
};

export type ChatFriendRequest = {
  user: ChatUser;
  createdAt: string;
};

export type ChatFriendRequests = {
  received: ChatFriendRequest[];
  sent: ChatFriendRequest[];
};

export type ChatRelationStatus =
  'none' | 'friend' | 'sent' | 'received' | 'blockedByMe' | 'blockedMe';

export type ChatRelation = {
  userId: ChatUserId;
  status: ChatRelationStatus;
  canDm: boolean;
};

export type ChatConversationPort = {
  listConversations(signal?: AbortSignal): Promise<ChatConversation[]>;
  markConversationRead(peerId: ChatUserId, lastReadMessageId: string): Promise<void>;
};

export type ChatMessagePort = {
  listMessages(peerId: ChatUserId, request?: ChatMessagePageRequest): Promise<ChatMessagePage>;
  sendMessage(peerId: ChatUserId, content: string): Promise<ChatMessage>;
};

export type ChatFriendPort = {
  getRelation(userId: ChatUserId, signal?: AbortSignal): Promise<ChatRelation>;
  listFriends(signal?: AbortSignal): Promise<ChatUser[]>;
  listFriendRequests(signal?: AbortSignal): Promise<ChatFriendRequests>;
  sendFriendRequest(userId: ChatUserId): Promise<void>;
  cancelFriendRequest(userId: ChatUserId): Promise<void>;
  acceptFriendRequest(userId: ChatUserId): Promise<void>;
  rejectFriendRequest(userId: ChatUserId): Promise<void>;
  removeFriend(userId: ChatUserId): Promise<void>;
  blockUser(userId: ChatUserId): Promise<void>;
  unblockUser(userId: ChatUserId): Promise<void>;
};

export type ChatUserPort = {
  getMe(signal?: AbortSignal): Promise<ChatUser>;
  getUser(userId: ChatUserId, signal?: AbortSignal): Promise<ChatUser>;
  searchUsers(query: string, signal?: AbortSignal): Promise<ChatUser[]>;
};

export type ChatAdapter = {
  conversations: ChatConversationPort;
  messages: ChatMessagePort;
  friends: ChatFriendPort;
  users: ChatUserPort;
};

export type ChatRoomEvent =
  | ({ type: 'snapshot' } & ChatMessagePage)
  | { type: 'messages'; messages: ChatMessage[] }
  | { type: 'error'; error: unknown };

export type ChatListEvent =
  { type: 'snapshot'; conversations: ChatConversation[] } | { type: 'error'; error: unknown };

export type ChatRealtimePort = {
  subscribeRoom(peerId: ChatUserId, onEvent: (event: ChatRoomEvent) => void): () => void;
  subscribeConversations(onEvent: (event: ChatListEvent) => void): () => void;
};
