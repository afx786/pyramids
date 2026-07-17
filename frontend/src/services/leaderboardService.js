import { api } from './api.js';

export const leaderboardService = {
  getLeaderboard() {
    return api.get('/leaderboard');
  },
};
