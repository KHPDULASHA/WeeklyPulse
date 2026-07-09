import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export async function getAllProjects() {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) api.defaults.headers.common.Authorization = 'Bearer ' + token;
  const res = await api.get('/projects');
  return res.data.projects;
}

export async function createProject(payload) {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) api.defaults.headers.common.Authorization = 'Bearer ' + token;
  const res = await api.post('/projects', payload);
  return res.data.project;
}

export async function updateProject(id, payload) {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) api.defaults.headers.common.Authorization = 'Bearer ' + token;
  const res = await api.put(`/projects/${id}`, payload);
  return res.data.project;
}

export async function deleteProject(id) {
  const token = localStorage.getItem('weeklypulse_token');
  if (token) api.defaults.headers.common.Authorization = 'Bearer ' + token;
  await api.delete(`/projects/${id}`);
  return true;
}