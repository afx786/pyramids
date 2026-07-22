import { api } from './api.js';

export const opportunityService = {
  listOpportunities() {
    return api.get('/opportunities');
  },
};
