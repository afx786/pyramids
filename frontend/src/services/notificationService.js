import { api } from './api.js';

export const notificationService = {
  listNotifications() {
    return api.get('/notifications');
  },

  markAsRead(notificationId) {
    return api.patch(`/notifications/${notificationId}/read`);
  },
};

export const NOTIFICATION_TYPES = {
  hackathon_approved: 'Hackathon Approved',
  hackathon_rejected: 'Hackathon Rejected',
  hackathon_changes_requested: 'Changes Requested',
  hackathon_published: 'Hackathon Published',
  research_invitation: 'Research Invitation',
  research_application: 'Research Application',
  submission_review: 'Submission Review',
  publication_accepted: 'Publication Accepted',
  org_invite: 'Organization Invite',
  org_verified: 'Organization Verified',
  admin_message: 'Admin Message',
};
