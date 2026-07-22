import { api } from './api.js';

export const contactService = {
  getMyInfo: () => api.get('/contacts/my-info'),
  updateMyInfo: (data) => api.put('/contacts/my-info', data),
  sendRequest: (targetId) => api.post('/contacts/request', { target_id: targetId }),
  approveRequest: (requestId) => api.post(`/contacts/request/${requestId}/approve`),
  declineRequest: (requestId) => api.post(`/contacts/request/${requestId}/decline`),
  getRequestStatus: (targetId) => api.get(`/contacts/request/status/${targetId}`),
  getReceivedRequests: () => api.get('/contacts/requests/received'),
  withdrawRequest: (requestId) => api.post(`/contacts/request/${requestId}/withdraw`),
};
