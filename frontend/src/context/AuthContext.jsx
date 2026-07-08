import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('weeklypulse_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get('/auth/me')
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('weeklypulse_token');
        delete api.defaults.headers.common.Authorization;
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user: authUser } = response.data;
    localStorage.setItem('weeklypulse_token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(authUser);
    return authUser;
  };

  const register = async (data) => {
    const response = await api.post('/auth/register', data);
    const { token, user: authUser } = response.data;
    localStorage.setItem('weeklypulse_token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem('weeklypulse_token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
