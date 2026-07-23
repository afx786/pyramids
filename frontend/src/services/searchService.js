import { api } from './api.js';

export const searchService = {
  searchUsersByName(name) {
    return api.get(`/search/users/by-name?name=${encodeURIComponent(name)}`);
  },

  searchByBuilderId(query) {
    return api.get(`/users/search-by-builder-id?q=${encodeURIComponent(query)}`);
  },

  searchProjects(query) {
    return api.get(`/search?q=${encodeURIComponent(query)}`);
  },
};
