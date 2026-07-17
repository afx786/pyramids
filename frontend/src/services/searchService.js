import { api } from './api.js';

export const searchService = {
  searchUsersByName(name) {
    return api.get(`/search/users/by-name?name=${encodeURIComponent(name)}`);
  },
};
