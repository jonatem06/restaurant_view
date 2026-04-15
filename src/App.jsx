import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages (to be implemented)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Kitchen from './pages/Kitchen';
import Personal from './pages/Personal';
import Productos from './pages/Productos';
import Finanzas from './pages/Finanzas';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={['gerente', 'vendedor', 'cocina']} />}>
        <Route element={<Layout />}>

          <Route element={<ProtectedRoute allowedRoles={['gerente']} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/finanzas" element={<Finanzas />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['gerente', 'vendedor']} />}>
            <Route path="/pos" element={<POS />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['gerente', 'cocina']} />}>
            <Route path="/kitchen" element={<Kitchen />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
}

export default App;
