import api from '../api/axios';

export const finanzasService = {
  getPuntoEquilibrio: () => api.get('/finanzas/punto-equilibrio'),
  getGananciaBruta: () => api.get('/ganancias/bruta'),
  getGananciaNeta: () => api.get('/ganancias/neta'),
  getGastos: () => api.get('/gastos'),
  createGasto: (data) => api.post('/gastos', data),
};
