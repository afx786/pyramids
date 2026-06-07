import { connectionGroups, requests } from '../data/mockData.js';
import { mockApiResponse } from './mockApi.js';

export const connectionService = {
  listConnections() {
    return mockApiResponse(connectionGroups);
  },

  listRequests() {
    return mockApiResponse(requests);
  },
};
