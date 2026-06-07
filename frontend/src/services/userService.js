import { currentUser, collaborators } from '../data/mockData.js';
import { mockApiResponse } from './mockApi.js';

export const userService = {
  getCurrentUser() {
    return mockApiResponse(currentUser);
  },

  getCollaborators() {
    return mockApiResponse(collaborators);
  },
};
