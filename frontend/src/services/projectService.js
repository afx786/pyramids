import { api } from './api.js';

export const projectService = {
  listProjects() {
    return api.get('/projects');
  },

  getProject(id) {
    return api.get(`/projects/${id}`);
  },

  createProject({ title, domain, description, skills, technologies = [] }) {
    return api.post('/projects', {
      title,
      domain,
      description,
      visibility: 'public',
      status: 'building',
      skills,
      technologies,
    });
  },

  updateProject(id, data) {
    return api.put(`/projects/${id}`, data);
  },

  deleteProject(id) {
    return api.delete(`/projects/${id}`);
  },
};
