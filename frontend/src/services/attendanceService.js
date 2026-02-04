import apiClient from './axiosConfig';

export const checkIn = async (dni, token) => {
  const res = await apiClient.post(
    '/attendance/check-in',
    { dni },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
  return res;
};

export default { checkIn };

