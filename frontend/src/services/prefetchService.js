import { connectionService } from './connectionService.js';
import { messageService } from './messageService.js';
import { notificationService } from './notificationService.js';

const prefetched = {};

export const prefetchService = {
  connections() {
    if (prefetched.connections) return;
    prefetched.connections = true;
    connectionService.listConnections().catch(() => {});
    connectionService.listIncomingRequests().catch(() => {});
  },
  messages() {
    if (prefetched.messages) return;
    prefetched.messages = true;
    messageService.listConversations().catch(() => {});
    connectionService.listConnections().catch(() => {});
  },
  notifications() {
    if (prefetched.notifications) return;
    prefetched.notifications = true;
    notificationService.list().catch(() => {});
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
