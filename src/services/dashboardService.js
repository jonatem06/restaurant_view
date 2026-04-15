import api from '../api/axios';

export const dashboardService = {
  getMasVendidosSemana: () => api.get('/dashboard/semana/productos-mas-vendidos'),
  getMasVendidosMes: () => api.get('/dashboard/mes/productos-mas-vendidos'),
  getGananciasSemana: () => api.get('/dashboard/semana/ganancias'),
  getGananciasMes: () => api.get('/dashboard/mes/ganancias'),
};
