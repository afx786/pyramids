import { api } from './api.js';

export const discoveryService = {
  listTeams() {
    return api.get('/teams');
  },

  getFeed(type = 'all') {
    return api.get(`/feed?type=${type}`);
  },
};
