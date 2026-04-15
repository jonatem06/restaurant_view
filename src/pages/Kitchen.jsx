import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ChefHat, Clock, CheckCircle } from 'lucide-react';

const Kitchen = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    newSocket.on('nueva_orden', (orden) => {
      setOrdenes(prev => [...prev, { ...orden, recibida: new Date() }]);
    });

    return () => newSocket.close();
  }, []);

  const completarOrden = (id) => {
    setOrdenes(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <ChefHat className="mr-3 text-blue-600" size={32} /> Monitor de Cocina
        </h1>
        <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Conectado en Tiempo Real
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ordenes.map((orden) => (
          <div key={orden.id} className="bg-white rounded-xl shadow-md border-t-8 border-blue-500 flex flex-col h-full">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orden</span>
                <p className="text-xl font-black text-gray-800">#{orden.id.toString().slice(-4)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 flex items-center justify-end">
                  <Clock size={12} className="mr-1" />
                  {new Date(orden.recibida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-3">
              {orden.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700 mr-3">
                      {item.quantity}
                    </span>
                    <span className="font-medium text-gray-800">{item.nombre}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 mt-auto">
              <button
                onClick={() => completarOrden(orden.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-colors"
              >
                <CheckCircle className="mr-2" size={20} /> Completar
              </button>
            </div>
          </div>
        ))}

        {ordenes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <ChefHat size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No hay órdenes pendientes</h3>
            <p className="text-gray-500">Las nuevas órdenes aparecerán aquí automáticamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen;
