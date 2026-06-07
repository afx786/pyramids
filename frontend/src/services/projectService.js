import { projects } from '../data/mockData.js';
import { mockApiResponse } from './mockApi.js';

export const projectService = {
  listProjects() {
    return mockApiResponse(projects);
  },

  createProject(payload) {
    return mockApiResponse({
      id: crypto.randomUUID(),
      ...payload,
      status: 'Draft',
    });
  },
};
