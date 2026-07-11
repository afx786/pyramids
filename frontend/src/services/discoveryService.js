import { api } from './api.js';

export const discoveryService = {
  listTeams() {
    return api.get('/teams');
  },

  listHackathons() {
    return api.get('/hackathons');
  },

  getFeed(type = 'all') {
    return api.get(`/feed?type=${type}`);
  },
};
