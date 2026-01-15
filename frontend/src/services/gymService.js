import apiClient from './axiosConfig';

export const getInviteCode = async (token) => {
  const res = await apiClient.get('/gyms/invite-code', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export const regenerateInviteCode = async (token) => {
  const res = await apiClient.post(
    '/gyms/invite-code',
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
  return res.data;
};

export default {
  getInviteCode,
  regenerateInviteCode,
};

