import { useState, useEffect } from 'react';
import { productoService } from '../services/productoService';
import { ventaService } from '../services/ventaService';
import { ShoppingCart, Plus, Minus, Trash2, Search } from 'lucide-react';

const POS = () => {
  const [productos, setProductos] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, m, pq] = await Promise.all([
          productoService.getProductos(),
          productoService.getMenu(),
          productoService.getPaquetes()
        ]);
        setProductos(p.data);
        setMenuItems(m.data);
        setPaquetes(pq.data);
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (item, type) => {
    const existing = cart.find(i => i.id === item.id && i.type === type);
    if (existing) {
      setCart(cart.map(i => i.id === item.id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, type, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, type, delta) => {
    setCart(cart.map(i => {
      if (i.id === id && i.type === type) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (id, type) => {
    setCart(cart.filter(i => !(i.id === id && i.type === type)));
  };

  const total = cart.reduce((sum, item) => sum + (item.precio || item.costo || 0) * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await ventaService.createVenta({
        items: cart.map(i => ({ id: i.id, type: i.type, quantity: i.quantity })),
        total,
        fecha: new Date().toISOString()
      });
      setCart([]);
      alert("Venta realizada con éxito");
    } catch (error) {
      console.error("Error creating sale", error);
      alert("Error al procesar la venta");
    }
  };

  const allItems = [
    ...productos.map(p => ({ ...p, type: 'producto' })),
    ...menuItems.map(m => ({ ...m, type: 'menu' })),
    ...paquetes.map(pq => ({ ...pq, type: 'paquete' }))
  ].filter(item => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div>Cargando POS...</div>;

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Left: Product Selection */}
      <div className="flex-1 flex flex-col">
        <div className="relative mb-6">
          <span className="absolute left-3 top-3 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Buscar productos, menú, paquetes..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
          {allItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => addToCart(item, item.type)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold text-white mb-2 inline-block ${
                  item.type === 'producto' ? 'bg-blue-500' :
                  item.type === 'menu' ? 'bg-green-500' : 'bg-purple-500'
                }`}>
                  {item.type}
                </span>
                <h4 className="font-semibold text-gray-800 line-clamp-2">{item.nombre}</h4>
              </div>
              <p className="text-blue-600 font-bold mt-2">${item.precio || item.costo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center">
            <ShoppingCart className="mr-2" size={20} /> Carrito
          </h3>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            {cart.length} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center justify-between group">
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-800 truncate">{item.nombre}</h5>
                <p className="text-xs text-gray-500">${item.precio || item.costo} c/u</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, item.type, -1)} className="p-1 hover:text-blue-600">
                    <Minus size={14} />
                  </button>
                  <span className="mx-2 text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item, item.type)} className="p-1 hover:text-blue-600">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id, item.type)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-20">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600 font-medium">Total a pagar:</span>
            <span className="text-3xl font-black text-gray-800">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Pagar Ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
