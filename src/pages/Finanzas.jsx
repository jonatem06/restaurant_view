import { useState, useEffect } from 'react';
import { finanzasService } from '../services/finanzasService';
import { Wallet, ArrowDownCircle, Plus, X } from 'lucide-react';

const Finanzas = () => {
  const [gastos, setGastos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ concepto: '', monto: '', categoria: 'fijo' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadGastos(); }, []);

  const loadGastos = async () => {
    try {
      const res = await finanzasService.getGastos();
      setGastos(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await finanzasService.createGasto(formData);
    setShowModal(false);
    loadGastos();
  };

  if (loading) return <div>Cargando finanzas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Finanzas y Gastos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700"
        >
          <Plus size={20} className="mr-2" /> Registrar Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Total Gastos Fijos</p>
          <p className="text-2xl font-bold text-red-600">
            ${gastos.filter(g => g.categoria === 'fijo').reduce((a, b) => a + b.monto, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500 text-sm">Total Gastos Variables</p>
          <p className="text-2xl font-bold text-orange-600">
            ${gastos.filter(g => g.categoria === 'variable').reduce((a, b) => a + b.monto, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center">
          <ArrowDownCircle className="text-red-500 mr-2" />
          <h3 className="font-bold">Historial de Gastos</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Concepto</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Categoría</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Monto</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {gastos.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{g.concepto}</td>
                <td className="px-6 py-4 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${g.categoria === 'fijo' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {g.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 text-red-600 font-bold">-${g.monto}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(g.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-600">Nuevo Gasto</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Concepto</label>
                <input required className="w-full px-3 py-2 border rounded-lg" value={formData.concepto} onChange={e => setFormData({...formData, concepto: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Monto</label>
                <input type="number" required className="w-full px-3 py-2 border rounded-lg" value={formData.monto} onChange={e => setFormData({...formData, monto: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <select className="w-full px-3 py-2 border rounded-lg" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                  <option value="fijo">Fijo</option>
                  <option value="variable">Variable</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
                Registrar Gasto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finanzas;
