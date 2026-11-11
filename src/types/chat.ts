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
  id: string;
  user: ChatUser;
  createdAt: string;
};

export type ChatFriendRequests = {
  received: ChatFriendRequest[];
  sent: ChatFriendRequest[];
};

export type ChatRelationStatus = 'none' | 'friend' | 'sent' | 'received';

export type ChatRelation = {
  user: ChatUser;
  status: ChatRelationStatus;
  requestId: string | null;
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
  sendFriendRequest(userId: ChatUserId): Promise<ChatFriendRequest>;
  cancelFriendRequest(requestId: string): Promise<void>;
  acceptFriendRequest(requestId: string): Promise<void>;
  rejectFriendRequest(requestId: string): Promise<void>;
  removeFriend(userId: ChatUserId): Promise<void>;
};

export type ChatAdapter = {
  conversations: ChatConversationPort;
  messages: ChatMessagePort;
  friends: ChatFriendPort;
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
