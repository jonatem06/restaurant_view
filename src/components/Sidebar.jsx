import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Utensils,
  ShoppingCart,
  ChefHat,
  LogOut,
  Wallet
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { title: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['gerente'] },
    { title: 'POS / Ventas', path: '/pos', icon: ShoppingCart, roles: ['gerente', 'vendedor'] },
    { title: 'Cocina', path: '/kitchen', icon: ChefHat, roles: ['gerente', 'cocina'] },
    { title: 'Personal', path: '/personal', icon: Users, roles: ['gerente'] },
    { title: 'Productos', path: '/productos', icon: Package, roles: ['gerente'] },
    { title: 'Finanzas', path: '/finanzas', icon: Wallet, roles: ['gerente'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Restaurante POS
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <item.icon size={20} />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="mb-4 px-3">
          <p className="text-sm text-gray-400">Usuario: {user?.username}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-600 transition-colors text-red-400 hover:text-white"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
