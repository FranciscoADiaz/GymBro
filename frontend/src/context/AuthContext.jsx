import { createContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../services/axiosConfig';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      setUser({ email: 'placeholder@gym.com' });
    }
    setLoading(false);
  }, []);

  const login = async (credentials = {}) => {
    const issuedToken = credentials.token || 'demo-token';
    setToken(issuedToken);
    localStorage.setItem('token', issuedToken);
    apiClient.defaults.headers.common.Authorization = `Bearer ${issuedToken}`;
    setUser({ email: credentials.email || 'user@example.com' });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common.Authorization;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
