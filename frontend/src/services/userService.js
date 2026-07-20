import { api } from './api.js';

export const userService = {
  getMe() {
    return api.get('/users/me');
  },

  getProfile(userId) {
    return api.get(`/profile/${userId}`);
  },

  getRank(userId) {
    return api.get(`/ranks/user/${userId}`);
  },

  updateProfile(data) {
    return api.put('/users/me', data);
  },
};
