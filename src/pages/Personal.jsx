import { useState, useEffect } from 'react';
import { personalService } from '../services/personalService';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const Personal = () => {
  const [personal, setPersonal] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '', apellidoPaterno: '', apellidoMaterno: '', rfc: '', imss: '',
    telefono: '', correo: '', usuario: '', contraseña: '', diasLaborales: '',
    horario: '', sueldo: ''
  });

  useEffect(() => { loadPersonal(); }, []);

  const loadPersonal = async () => {
    const res = await personalService.getAll();
    setPersonal(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await personalService.update(editingId, formData);
      else await personalService.create(formData);

      setShowModal(false);
      setEditingId(null);
      setFormData({
        nombres: '', apellidoPaterno: '', apellidoMaterno: '', rfc: '', imss: '',
        telefono: '', correo: '', usuario: '', contraseña: '', diasLaborales: '',
        horario: '', sueldo: ''
      });
      loadPersonal();
    } catch (error) {
      console.error("Error saving personal", error);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData(p);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar empleado?')) {
      await personalService.delete(id);
      loadPersonal();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Personal</h1>
        <button
          onClick={() => { setEditingId(null); setFormData({
            nombres: '', apellidoPaterno: '', apellidoMaterno: '', rfc: '', imss: '',
            telefono: '', correo: '', usuario: '', contraseña: '', diasLaborales: '',
            horario: '', sueldo: ''
          }); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" /> Agregar Empleado
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Nombre</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Usuario</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Horario</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Sueldo</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {personal.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{`${p.nombres} ${p.apellidoPaterno}`}</td>
                <td className="px-6 py-4 text-gray-500">{p.usuario}</td>
                <td className="px-6 py-4">{p.horario}</td>
                <td className="px-6 py-4 font-medium">${p.sueldo}</td>
                <td className="px-6 py-4 flex space-x-3">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Nuevo'} Empleado</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Nombres" value={formData.nombres} onChange={v => setFormData({...formData, nombres: v})} />
              <Input label="Apellido Paterno" value={formData.apellidoPaterno} onChange={v => setFormData({...formData, apellidoPaterno: v})} />
              <Input label="Apellido Materno" value={formData.apellidoMaterno} onChange={v => setFormData({...formData, apellidoMaterno: v})} />
              <Input label="RFC" value={formData.rfc} onChange={v => setFormData({...formData, rfc: v})} />
              <Input label="IMSS" value={formData.imss} onChange={v => setFormData({...formData, imss: v})} />
              <Input label="Teléfono" value={formData.telefono} onChange={v => setFormData({...formData, telefono: v})} />
              <Input label="Correo" type="email" value={formData.correo} onChange={v => setFormData({...formData, correo: v})} />
              <Input label="Usuario" value={formData.usuario} onChange={v => setFormData({...formData, usuario: v})} />
              {!editingId && <Input label="Contraseña" type="password" value={formData.contraseña} onChange={v => setFormData({...formData, contraseña: v})} />}
              <Input label="Días Laborales" placeholder="Lunes-Viernes" value={formData.diasLaborales} onChange={v => setFormData({...formData, diasLaborales: v})} />
              <Input label="Horario" placeholder="09:00 - 18:00" value={formData.horario} onChange={v => setFormData({...formData, horario: v})} />
              <Input label="Sueldo" type="number" value={formData.sueldo} onChange={v => setFormData({...formData, sueldo: v})} />

              <div className="col-span-full pt-6 flex justify-end space-x-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700">
                  <Save size={20} className="mr-2" /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      required
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default Personal;
