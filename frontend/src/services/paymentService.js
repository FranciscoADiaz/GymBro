import apiClient from './axiosConfig';

export const createPayment = async (data, token) => {
  const res = await apiClient.post('/payments', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return res.data;
};

export default {
  createPayment,
};

