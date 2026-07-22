import { api } from './api.js';
import { buildEntityUrl } from '../utils/resolveEntity.js';

export const hackathonService = {
  listPublished(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/hackathons${query ? `?${query}` : ''}`);
  },

  get(id) {
    return api.get(buildEntityUrl('/hackathons', id));
  },

  // Host
  createDraft(data) {
    return api.post('/hackathons/drafts', data);
  },

  getHostHackathons() {
    return api.get('/hackathons/host');
  },

  update(id, data) {
    return api.patch(`/hackathons/${id}`, data);
  },

  deleteDraft(id) {
    return api.delete(`/hackathons/drafts/${id}`);
  },

  submitForReview(id) {
    return api.post(`/hackathons/${id}/submit`);
  },

  publish(id) {
    return api.post(`/hackathons/${id}/publish`);
  },

  complete(id) {
    return api.post(`/hackathons/${id}/complete`);
  },

  archive(id) {
    return api.post(`/hackathons/${id}/archive`);
  },

  // Admin
  getPending() {
    return api.get('/hackathons/pending');
  },

  approve(id, feedback) {
    const query = feedback ? `?feedback=${encodeURIComponent(feedback)}` : '';
    return api.post(`/hackathons/${id}/approve${query}`);
  },

  reject(id, feedback) {
    const query = feedback ? `?feedback=${encodeURIComponent(feedback)}` : '';
    return api.post(`/hackathons/${id}/reject${query}`);
  },

  requestChanges(id, feedback) {
    const query = feedback ? `?feedback=${encodeURIComponent(feedback)}` : '';
    return api.post(`/hackathons/${id}/request-changes${query}`);
  },

  // Registration
  registerTeam(hackathonId, teamId) {
    return api.post(`/hackathons/${hackathonId}/register-team`, { team_id: teamId });
  },

  getTeams(hackathonId) {
    return api.get(`/hackathons/${hackathonId}/teams`);
  },

  // Submissions
  submitProject(hackathonId, data) {
    return api.post(`/hackathons/${hackathonId}/submissions`, data);
  },

  getSubmissions(hackathonId) {
    return api.get(`/hackathons/${hackathonId}/submissions`);
  },

  reviewSubmission(submissionId, status) {
    return api.post(`/hackathons/submissions/${submissionId}/review?status=${status}`);
  },

  // Announcements
  createAnnouncement(hackathonId, data) {
    return api.post(`/hackathons/${hackathonId}/announcements`, data);
  },

  getAnnouncements(hackathonId) {
    return api.get(`/hackathons/${hackathonId}/announcements`);
  },

  // Invitations
  getMyInvitations() {
    return api.get('/hackathons/invitations/my');
  },

  acceptInvitation(id) {
    return api.post(`/hackathons/invitations/${id}/accept`);
  },

  rejectInvitation(id) {
    return api.post(`/hackathons/invitations/${id}/reject`);
  },
};
