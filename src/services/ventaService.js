import api from '../api/axios';

export const ventaService = {
  getVentas: () => api.get('/ventas'),
  createVenta: (data) => api.post('/ventas', data),
};
