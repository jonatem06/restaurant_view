import api from '../api/axios';

export const personalService = {
  getAll: () => api.get('/personal'),
  create: (data) => api.post('/personal', data),
  update: (id, data) => api.put(`/personal/${id}`, data),
  delete: (id) => api.delete(`/personal/${id}`),
};
