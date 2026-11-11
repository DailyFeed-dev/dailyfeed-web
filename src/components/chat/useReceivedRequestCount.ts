import { useEffect, useState } from 'react';

import { friendService } from '@/services/chatService';

export function useReceivedRequestCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    friendService
      .listFriendRequests(controller.signal)
      .then((requests) => setCount(requests.received.length))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return count;
}
