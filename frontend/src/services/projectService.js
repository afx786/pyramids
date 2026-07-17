import { api } from './api.js';

export const projectService = {
  listProjects() {
    return api.get('/projects');
  },

  getProject(id) {
    return api.get(`/projects/${id}`);
  },

  createProject({ title, domain, description, skills, technologies = [], github_url }) {
    return api.post('/projects', {
      title,
      domain,
      description,
      visibility: 'public',
      status: 'building',
      skills,
      technologies,
      ...(github_url ? { github_url } : {}),
    });
  },

  updateProject(id, data) {
    return api.put(`/projects/${id}`, data);
  },

  deleteProject(id) {
    return api.delete(`/projects/${id}`);
  },

  listMembers(projectId) {
    return api.get(`/projects/${projectId}/members`);
  },

  listInvitations(projectId) {
    return api.get(`/projects/${projectId}/invitations`);
  },

  inviteUser(projectId, userId) {
    return api.post(`/projects/${projectId}/invitations`, { user_id: userId });
  },

  verifyRepository(projectId, githubUrl) {
    return api.post(`/projects/${projectId}/verify`, { github_url: githubUrl });
  },
};
