import { api } from './api.js';
import { buildEntityUrl } from '../utils/resolveEntity.js';

export const researchService = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/research${query ? `?${query}` : ''}`);
  },

  get(id) {
    return api.get(buildEntityUrl('/research', id));
  },

  getMy() {
    return api.get('/research/my');
  },

  create(data) {
    return api.post('/research', data);
  },

  update(id, data) {
    return api.patch(`/research/${id}`, data);
  },

  delete(id) {
    return api.delete(`/research/${id}`);
  },

  getMembers(id) {
    return api.get(`/research/${id}/members`);
  },

  join(id) {
    return api.post(`/research/${id}/join`);
  },

  leave(id) {
    return api.post(`/research/${id}/leave`);
  },

  getRequests(id) {
    return api.get(`/research/${id}/requests`);
  },

  approveRequest(requestId) {
    return api.post(`/research/requests/${requestId}/approve`);
  },

  rejectRequest(requestId) {
    return api.post(`/research/requests/${requestId}/reject`);
  },

  // Milestones
  createMilestone(id, data) {
    return api.post(`/research/${id}/milestones`, data);
  },

  getMilestones(id) {
    return api.get(`/research/${id}/milestones`);
  },

  completeMilestone(milestoneId) {
    return api.post(`/research/milestones/${milestoneId}/complete`);
  },

  // Updates
  createUpdate(id, content) {
    return api.post(`/research/${id}/updates`, { content });
  },

  getUpdates(id) {
    return api.get(`/research/${id}/updates`);
  },
};
