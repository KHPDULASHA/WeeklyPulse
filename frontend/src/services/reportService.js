import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getMyReports() {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  const response = await api.get('/reports/me');
  return response.data.reports;
}

export async function createReport(payload) {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  const response = await api.post('/reports', payload);
  return response.data.report;
}

export async function updateReport(id, payload) {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  const response = await api.put(`/reports/${id}`, payload);
  return response.data.report;
}

export async function submitReport(id) {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  const response = await api.post(`/reports/${id}/submit`);
  return response.data.report;
}
