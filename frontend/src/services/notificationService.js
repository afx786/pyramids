import { api } from './api.js';

export const notificationService = {
  listNotifications() {
    return api.get('/notifications');
  },

  markAsRead(notificationId) {
    return api.patch(`/notifications/${notificationId}/read`);
  },
};
