import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { finanzasService } from '../services/finanzasService';
import { DollarSign, TrendingUp, TrendingDown, Package, Activity } from 'lucide-react';

const Dashboard = () => {
  const [masVendidos, setMasVendidos] = useState([]);
  const [gananciasSemana, setGananciasSemana] = useState([]);
  const [gananciasMes, setGananciasMes] = useState([]);
  const [puntoEquilibrio, setPuntoEquilibrio] = useState(null);
  const [gananciaBruta, setGananciaBruta] = useState(0);
  const [gananciaNeta, setGananciaNeta] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mv, gs, gm, pe, gb, gn] = await Promise.all([
          dashboardService.getMasVendidosSemana(),
          dashboardService.getGananciasSemana(),
          dashboardService.getGananciasMes(),
          finanzasService.getPuntoEquilibrio(),
          finanzasService.getGananciaBruta(),
          finanzasService.getGananciaNeta()
        ]);

        setMasVendidos(mv.data);
        setGananciasSemana(gs.data);
        setGananciasMes(gm.data);
        setPuntoEquilibrio(pe.data);
        setGananciaBruta(gb.data);
        setGananciaNeta(gn.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Cargando dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ganancia Bruta" value={`$${gananciaBruta}`} icon={DollarSign} color="bg-blue-500" />
        <StatCard title="Ganancia Neta" value={`$${gananciaNeta}`} icon={TrendingUp} color="bg-green-500" />
        <StatCard title="Gastos Fijos" value={`$${puntoEquilibrio?.gastosFijos || 0}`} icon={TrendingDown} color="bg-red-500" />
        <StatCard title="Sueldos" value={`$${puntoEquilibrio?.sueldos || 0}`} icon={Package} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Más Vendidos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos (Semana)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ganancias Semanales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Ganancias Semanales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gananciasSemana}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Punto de Equilibrio Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Activity className="mr-2 text-blue-600" /> Punto de Equilibrio
        </h3>
        {puntoEquilibrio && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <PEStat label="Margen Promedio" value={`${(puntoEquilibrio.margenPromedio * 100).toFixed(1)}%`} />
              <PEStat label="Ventas Actuales" value={`$${puntoEquilibrio.ventasTotales}`} />
              <PEStat label="Diferencia" value={`$${puntoEquilibrio.diferencia}`} color={puntoEquilibrio.diferencia >= 0 ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div className="space-y-4">
              <PEStat label="PE en Ventas" value={puntoEquilibrio.puntoEquilibrioVentas} />
              <PEStat label="PE en Dinero" value={`$${puntoEquilibrio.puntoEquilibrioDinero}`} />
              <PEStat label="Ticket Promedio" value={`$${puntoEquilibrio.ticketPromedio}`} />
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className={`text-2xl font-black uppercase px-6 py-3 rounded-full border-4 ${
                puntoEquilibrio.estado === 'ganancia' ? 'border-green-500 text-green-500' :
                puntoEquilibrio.estado === 'equilibrio' ? 'border-blue-500 text-blue-500' : 'border-red-500 text-red-500'
              }`}>
                {puntoEquilibrio.estado}
              </div>
              <p className="mt-4 text-gray-500 text-sm">Estado Actual del Negocio</p>

              <div className="w-full mt-6 bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    puntoEquilibrio.estado === 'ganancia' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${puntoEquilibrio.puntoEquilibrioDinero > 0 ? Math.min((puntoEquilibrio.ventasTotales / puntoEquilibrio.puntoEquilibrioDinero) * 100, 100) : 0}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">Progreso hacia el punto de equilibrio</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`${color} p-3 rounded-lg text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const PEStat = ({ label, value, color = 'text-gray-800' }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

export default Dashboard;
