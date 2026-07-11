import { api } from './api.js';

export const connectionService = {
  listConnections() {
    return api.get('/connections');
  },

  listIncomingRequests() {
    return api.get('/connections/requests/incoming');
  },

  listOutgoingRequests() {
    return api.get('/connections/requests/outgoing');
  },

  sendRequest(receiverId) {
    return api.post('/connections/request', { receiver_id: receiverId });
  },

  acceptRequest(requestId) {
    return api.post(`/connections/${requestId}/accept`);
  },

  rejectRequest(requestId) {
    return api.post(`/connections/${requestId}/reject`);
  },

  cancelRequest(requestId) {
    return api.delete(`/connections/requests/${requestId}`);
  },

  removeConnection(connectionId) {
    return api.delete(`/connections/${connectionId}`);
  },
};
