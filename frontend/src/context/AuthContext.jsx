import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { connectWebSocket, disconnectWebSocket } from '../services/websocketService.js';

const TOKEN_KEY = 'pyramids_token';
const USER_KEY = 'pyramids_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [profile, setProfile] = useState(null);
  const [rankData, setRankData] = useState(null);

  const loadProfileAndRank = useCallback(async (userId) => {
    try {
      const [profileData, rank] = await Promise.all([
        api.get(`/profile/${userId}`),
        api.get(`/ranks/user/${userId}`),
      ]);
      setProfile(profileData);
      setRankData(rank);
    } catch (err) {
      console.warn('[auth] failed to load profile/rank:', err);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadProfileAndRank(user.id);
      connectWebSocket();
    }
  }, [user?.id, loadProfileAndRank]);

  const login = useCallback(async ({ email, password }) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    const me = await api.get('/users/me');
    localStorage.setItem(USER_KEY, JSON.stringify(me));
    setUser(me);
    connectWebSocket();
    return me;
  }, []);

  const signup = useCallback(async ({ name, program, email, password }) => {
    await api.post('/auth/signup', { name, program, email, password });
    return login({ email, password });
  }, [login]);

  const logout = useCallback(() => {
    disconnectWebSocket();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setProfile(null);
    setRankData(null);
  }, []);

  const isAuthenticated = !!localStorage.getItem(TOKEN_KEY);

  return (
    <AuthContext.Provider value={{ user, profile, rankData, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
