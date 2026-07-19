import { api } from './api.js';

export const messageService = {
  listConversations(params) {
    const qs = params?.toString ? `?${params.toString()}` : '';
    return api.get(`/messages/conversations${qs}`);
  },

  getMessages(conversationId) {
    return api.get(`/messages/conversations/${conversationId}`);
  },

  startConversation(userId) {
    return api.post('/messages/conversations', { user_id: userId });
  },

  sendMessage(conversationId, content) {
    return api.post('/messages', { conversation_id: conversationId, content });
  },

  deleteMessage(messageId) {
    return api.delete(`/messages/${messageId}`);
  },

  deleteConversation(conversationId) {
    return api.delete(`/messages/conversations/${conversationId}`);
  },
};
