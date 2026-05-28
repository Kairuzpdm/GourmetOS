import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminHome from './pages/Admin/AdminHome';
import MenuManager from './pages/Admin/MenuManager';
import Reporte from './pages/Admin/Reporte';
import MeseroDashboard from './pages/Mesero/MeseroDashboard';
import CocinaDashboard from './pages/Cocina/CocinaDashboard';
import CajeroDashboard from './pages/Cajero/CajeroDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.rol)) return <Navigate to="/unauthorized" />;
  
  return children;
};

// Componente para redirigir según el rol al iniciar sesión
const RoleBasedRedirect = () => {
    const { user } = useAuthStore();
    if (user?.rol === 'admin') return <Navigate to="/admin" />;
    if (user?.rol === 'mesero') return <Navigate to="/mesero" />;
    if (user?.rol === 'cocina') return <Navigate to="/cocina" />;
    if (user?.rol === 'cajero') return <Navigate to="/cajero" />;
    return <Navigate to="/login" />;
};

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
            isAuthenticated ? <RoleBasedRedirect /> : <Login />
        } />
        
        {/* Rutas de Administrador */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }>
            <Route index element={<AdminHome />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="reporte" element={<Reporte />} />
        </Route>

        {/* Ruta de Mesero */}
        <Route path="/mesero" element={
            <ProtectedRoute allowedRoles={['mesero', 'admin']}>
                <MeseroDashboard />
            </ProtectedRoute>
        } />

        {/* Ruta de Cocina */}
        <Route path="/cocina" element={
            <ProtectedRoute allowedRoles={['cocina', 'admin']}>
                <CocinaDashboard />
            </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                <h2>Acceso Denegado</h2>
                <p>No tienes permisos para ver esta página.</p>
                <button onClick={() => useAuthStore.getState().logout()} className="btn-primary" style={{marginTop: '1rem'}}>
                    Volver a Login
                </button>
            </div>
        } />

        {/* Ruta de Cajero */}
        <Route path="/cajero" element={
            <ProtectedRoute allowedRoles={['cajero', 'admin']}>
                <CajeroDashboard />
            </ProtectedRoute>
        } />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
