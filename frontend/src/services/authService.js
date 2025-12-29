import apiClient from './axiosConfig';

export const login = async (email, password) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

export const register = async (userData) => {
  const { data } = await apiClient.post('/auth/register', userData);
  return data;
};

export default { login, register };

