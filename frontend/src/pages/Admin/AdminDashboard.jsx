import { useAuthStore } from '../../store/useAuthStore';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Utensils, BarChart2, LogOut } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Gourmet<span className="accent">OS</span></h2>
                    <p>Panel Administrador</p>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/admin" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <LayoutDashboard size={20} />
                        <span>Resumen</span>
                    </NavLink>
                    <NavLink to="/admin/menu" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Utensils size={20} />
                        <span>Gestión de Menú</span>
                    </NavLink>
                    <NavLink to="/admin/reporte" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                        <BarChart2 size={20} />
                        <span>Reporte de Ventas</span>
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{user?.nombre?.charAt(0)}</div>
                        <div className="user-details">
                            <span className="user-name">{user?.nombre}</span>
                            <span className="user-role">{user?.rol}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}
