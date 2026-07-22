import { connectionService } from './connectionService.js';
import { messageService } from './messageService.js';
import { notificationService } from './notificationService.js';

const prefetched = {};

export const prefetchService = {
  connections() {
    if (prefetched.connections) return;
    prefetched.connections = true;
    connectionService.listConnections().catch(() => console.warn('[prefetch] connections failed'));
    connectionService.listIncomingRequests().catch(() => console.warn('[prefetch] incoming requests failed'));
  },
  messages() {
    if (prefetched.messages) return;
    prefetched.messages = true;
    messageService.listConversations().catch(() => console.warn('[prefetch] conversations failed'));
    connectionService.listConnections().catch(() => console.warn('[prefetch] connections failed'));
  },
  notifications() {
    if (prefetched.notifications) return;
    prefetched.notifications = true;
    notificationService.listNotifications().catch(() => console.warn('[prefetch] notifications failed'));
  },
  search() {
    /* prefetch is minimal for search */
  },
  profile() {
    /* prefetched by auth context */
  },
  dashboard() {
    /* prefetched by auth context */
  },
};
