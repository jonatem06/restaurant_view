import api from '../api/axios';

export const productoService = {
  // Productos
  getProductos: () => api.get('/productos'),
  createProducto: (data) => api.post('/productos', data),
  updateProducto: (id, data) => api.put(`/productos/${id}`, data),
  deleteProducto: (id) => api.delete(`/productos/${id}`),

  // Recetas
  getRecetas: () => api.get('/recetas'),
  createReceta: (data) => api.post('/recetas', data),

  // Menú
  getMenu: () => api.get('/menu'),
  createMenu: (data) => api.post('/menu', data),

  // Paquetes
  getPaquetes: () => api.get('/paquetes'),
  createPaquetes: (data) => api.post('/paquetes', data),
};
