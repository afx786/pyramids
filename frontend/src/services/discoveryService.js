import { domains, rankMilestones, teams } from '../data/mockData.js';
import { mockApiResponse } from './mockApi.js';

export const discoveryService = {
  listDomains() {
    return mockApiResponse(domains);
  },

  listTeams() {
    return mockApiResponse(teams);
  },

  listRankMilestones() {
    return mockApiResponse(rankMilestones);
  },
};
