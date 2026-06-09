export const BASE_URL = 'http://10.0.2.2:8000/api'; // Android emulator → localhost

export const ENDPOINTS = {
  entry: `${BASE_URL}/entry/`,
  exit: (id: number) => `${BASE_URL}/exit/${id}/`,
  current: `${BASE_URL}/current/`,
  history: `${BASE_URL}/history/`,
  status: `${BASE_URL}/status/`,
};
