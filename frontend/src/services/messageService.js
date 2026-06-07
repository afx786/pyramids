import { conversations } from '../data/mockData.js';
import { mockApiResponse } from './mockApi.js';

export const messageService = {
  listConversations() {
    return mockApiResponse(conversations);
  },

  sendMessage(conversationId, text) {
    return mockApiResponse({
      id: crypto.randomUUID(),
      conversationId,
      text,
      mine: true,
    });
  },
};
