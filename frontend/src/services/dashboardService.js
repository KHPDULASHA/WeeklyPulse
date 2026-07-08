import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getManagerDashboard() {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  const response = await api.get('/dashboard');
  return response.data;
}
