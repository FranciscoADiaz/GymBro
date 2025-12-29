import { createContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../services/axiosConfig';
import { login as loginService, register as registerService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (_e) {
          setUser(null);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token: issuedToken, user: issuedUser } = await loginService(email, password);
      setToken(issuedToken);
      setUser(issuedUser);
      localStorage.setItem('token', issuedToken);
      localStorage.setItem('user', JSON.stringify(issuedUser));
      apiClient.defaults.headers.common.Authorization = `Bearer ${issuedToken}`;
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { token: issuedToken, user: issuedUser } = await registerService(userData);
      setToken(issuedToken);
      setUser(issuedUser);
      localStorage.setItem('token', issuedToken);
      localStorage.setItem('user', JSON.stringify(issuedUser));
      apiClient.defaults.headers.common.Authorization = `Bearer ${issuedToken}`;
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al registrar';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common.Authorization;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
