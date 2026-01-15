import apiClient from './axiosConfig';

export const getMemberships = async (token) => {
  const res = await apiClient.get('/memberships', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const createMembership = async (data, token) => {
  const res = await apiClient.post('/memberships', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export default {
  getMemberships,
  createMembership,
};

