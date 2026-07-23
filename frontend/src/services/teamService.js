import { api } from './api.js';
import { buildEntityUrl } from '../utils/resolveEntity.js';

export const teamService = {
  listTeams() {
    return api.get('/teams');
  },

  getTeam(id) {
    return api.get(buildEntityUrl('/teams', id));
  },

  createTeam(data) {
    return api.post('/teams', data);
  },

  joinTeam(teamId) {
    return api.post(`/teams/${teamId}/join`);
  },

  leaveTeam(teamId) {
    return api.post(`/teams/${teamId}/leave`);
  },

  deleteTeam(teamId) {
    return api.delete(`/teams/${teamId}`);
  },

  transferOwnership(teamId, newOwnerId) {
    return api.post(`/teams/${teamId}/transfer-ownership`, { new_owner_id: newOwnerId });
  },

  listRequests(teamId) {
    return api.get(`/teams/${teamId}/requests`);
  },

  approveRequest(requestId) {
    return api.post(`/teams/requests/${requestId}/approve`);
  },

  rejectRequest(requestId) {
    return api.post(`/teams/requests/${requestId}/reject`);
  },

  addMember(teamId, userId, role = 'Member') {
    return api.post(`/teams/${teamId}/members`, { user_id: userId, role });
  },

  removeMember(teamId, userId) {
    return api.delete(`/teams/${teamId}/members/${userId}`);
  },

  updateMemberRole(teamId, userId, role) {
    return api.patch(`/teams/${teamId}/members/${userId}/role`, { role });
  },

  inviteByBuilderId(teamId, builderId, role = 'Member') {
    return api.post(`/teams/${teamId}/invite-by-builder-id`, { builder_id: builderId, role });
  },

  searchByBuilderId(query) {
    return api.get(`/users/search-by-builder-id?q=${encodeURIComponent(query)}`);
  },

  findByBuilderId(builderId) {
    return api.get(`/users/by-builder-id?builder_id=${encodeURIComponent(builderId)}`);
  },
};
