import apiClient from './axiosConfig';

export const getClasses = async (token) => {
  const res = await apiClient.get('/classes', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const createClass = async (data, token) => {
  const res = await apiClient.post('/classes', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const deleteClass = async (id, token) => {
  const res = await apiClient.delete(`/classes/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export default {
  getClasses,
  createClass,
  deleteClass,
};

