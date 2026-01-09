import apiClient from './axiosConfig';

export const getMembers = async (token) => {
  const res = await apiClient.get('/members', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const createMember = async (data, token) => {
  const res = await apiClient.post('/members', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const deleteMember = async (id, token) => {
  const res = await apiClient.delete(`/members/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const updateMember = async (id, data, token) => {
  const res = await apiClient.put(`/members/${id}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export default {
  getMembers,
  createMember,
  deleteMember,
  updateMember,
};

