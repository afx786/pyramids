import { api } from './api.js';
import { buildEntityUrl } from '../utils/resolveEntity.js';

export const organizationService = {
  list() {
    return api.get('/organizations');
  },

  get(id) {
    return api.get(buildEntityUrl('/organizations', id));
  },

  getMy() {
    return api.get('/organizations/my');
  },

  create(data) {
    return api.post('/organizations', data);
  },

  update(id, data) {
    return api.patch(`/organizations/${id}`, data);
  },

  delete(id) {
    return api.delete(`/organizations/${id}`);
  },

  getMembers(id) {
    return api.get(`/organizations/${id}/members`);
  },

  addMember(id, userId) {
    return api.post(`/organizations/${id}/members?user_id=${userId}`);
  },

  removeMember(id, userId) {
    return api.delete(`/organizations/${id}/members/${userId}`);
  },
};
