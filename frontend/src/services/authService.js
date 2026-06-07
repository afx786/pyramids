const AUTH_KEY = 'pyramids_mock_auth';

export const authService = {
  isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true';
  },

  login(credentials) {
    localStorage.setItem(AUTH_KEY, 'true');
    return Promise.resolve({ user: credentials.email });
  },

  signup(payload) {
    localStorage.setItem(AUTH_KEY, 'true');
    return Promise.resolve({ user: payload.email });
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};
