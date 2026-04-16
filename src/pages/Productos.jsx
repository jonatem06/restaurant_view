import { useState, useEffect } from 'react';
import { productoService } from '../services/productoService';
import { Plus, Edit2, Trash2, X, Save, ChefHat, BookOpen, Package, AlertCircle, CheckCircle2 } from 'lucide-react';

const Productos = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', costo: '', precio: '', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => { loadData(); }, [activeTab]);

  const loadData = async () => {
    let res;
    try {
      if (activeTab === 'productos') res = await productoService.getProductos();
      else if (activeTab === 'recetas') res = await productoService.getRecetas();
      else if (activeTab === 'menu') res = await productoService.getMenu();
      else res = await productoService.getPaquetes();
      setData(res.data);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        if (activeTab === 'productos') await productoService.updateProducto(editingId, formData);
        // Add others if backend supports updates for them
      } else {
        if (activeTab === 'productos') await productoService.createProducto(formData);
        else if (activeTab === 'recetas') await productoService.createReceta(formData);
        else if (activeTab === 'menu') await productoService.createMenu(formData);
        else await productoService.createPaquetes(formData);
      }

      setSuccess("Elemento guardado correctamente");
      setTimeout(() => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ nombre: '', costo: '', precio: '', descripcion: '' });
        setSuccess(null);
      }, 1500);
      loadData();
    } catch (error) {
      console.error("Error saving", error);
      setError(error.response?.data?.message || "Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      nombre: item.nombre,
      costo: item.costo || '',
      precio: item.precio || '',
      descripcion: item.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este elemento?')) return;
    try {
      if (activeTab === 'productos') await productoService.deleteProducto(id);
      // Backend didn't specify DELETE for others, but adding generic if needed
      loadData();
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ nombre: '', costo: '', precio: '', descripcion: '' });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" /> Agregar {activeTab.slice(0, -1)}
        </button>
      </div>

      <div className="flex space-x-4 border-b">
        <TabButton active={activeTab === 'productos'} onClick={() => setActiveTab('productos')} icon={Package} label="Inventario" />
        <TabButton active={activeTab === 'recetas'} onClick={() => setActiveTab('recetas')} icon={BookOpen} label="Recetas" />
        <TabButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={ChefHat} label="Menú" />
        <TabButton active={activeTab === 'paquetes'} onClick={() => setActiveTab('paquetes')} icon={Package} label="Paquetes" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Nombre</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Costo/Precio</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Margen</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{item.nombre}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-500">Costo: ${item.costo || 0}</p>
                    <p className="text-blue-600 font-bold">Venta: ${item.precio || 0}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {item.precio && item.costo ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      {(((item.precio - item.costo) / item.precio) * 100).toFixed(0)}%
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Item - {activeTab}</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm">
                  <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl flex items-center text-sm">
                  <CheckCircle2 size={18} className="mr-2 flex-shrink-0" />
                  {success}
                </div>
              )}
              <Input label="Nombre" value={formData.nombre} onChange={v => setFormData({...formData, nombre: v})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Costo" type="number" value={formData.costo} onChange={v => setFormData({...formData, costo: v})} />
                <Input label="Precio Venta" type="number" value={formData.precio} onChange={v => setFormData({...formData, precio: v})} />
              </div>
              <Input label="Descripción" value={formData.descripcion} onChange={v => setFormData({...formData, descripcion: v})} />
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
      active ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </button>
);

const Input = ({ label, type = 'text', value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      required
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default Productos;
