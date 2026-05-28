import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import './CajeroDashboard.css';
import { LogOut, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CajeroDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [reporte, setReporte] = useState({ total_ventas: 0, total_pedidos: 0 });

    const fetchData = async () => {
        try {
            const [pedidosRes, reporteRes] = await Promise.all([
                api.get('/pedidos/por-cobrar'),
                api.get('/reportes/ventas-dia')
            ]);
            setPedidos(pedidosRes.data);
            setReporte(reporteRes.data || { total_ventas: 0, total_pedidos: 0 });
        } catch (error) {
            console.error('Error fetching cajero data', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cobrarPedido = async (id, mesa_id) => {
        if (!window.confirm('¿Confirmar cobro y liberar mesa?')) return;
        try {
            await api.post(`/pedidos/${id}/pagar`, { mesa_id });
            alert('Cobro registrado. Mesa liberada.');
            fetchData();
        } catch (error) {
            alert('Error procesando cobro');
        }
    };

    return (
        <div className="cajero-layout">
            <header className="cajero-header">
                <div className="brand">
                    <DollarSign size={32} className="accent-icon" />
                    <h2>Gourmet<span className="accent">OS</span> Caja</h2>
                </div>
                <div className="user-section">
                    <span>Cajero(a) {user?.nombre}</span>
                    <button className="btn-icon" onClick={handleLogout}><LogOut size={18} /></button>
                </div>
            </header>

            <main className="cajero-content">
                <section className="report-section">
                    <div className="report-card">
                        <div className="report-icon-box">
                            <TrendingUp size={24} />
                        </div>
                        <div className="report-info">
                            <span className="report-label">Ventas del Día</span>
                            <span className="report-value">${reporte.total_ventas || '0.00'}</span>
                        </div>
                    </div>
                    <div className="report-card">
                        <div className="report-icon-box orange">
                            <Receipt size={24} />
                        </div>
                        <div className="report-info">
                            <span className="report-label">Pedidos Cobrados</span>
                            <span className="report-value">{reporte.total_pedidos || 0}</span>
                        </div>
                    </div>
                </section>

                <section className="pedidos-section">
                    <h3>Pedidos Pendientes de Cobro</h3>
                    <div className="cobro-grid">
                        {pedidos.length === 0 ? (
                            <p className="empty-msg">No hay pedidos pendientes de cobro.</p>
                        ) : (
                            pedidos.map(pedido => (
                                <div key={pedido.id} className="cobro-card">
                                    <div className="cobro-header">
                                        <span className="mesa">{pedido.numero_mesa}</span>
                                        <span className={`estado-badge ${pedido.estado}`}>{pedido.estado}</span>
                                    </div>
                                    <div className="cobro-body">
                                        <span className="total-label">Total a Pagar</span>
                                        <span className="total-monto">${pedido.total}</span>
                                    </div>
                                    <button 
                                        className="btn-primary w-100" 
                                        onClick={() => cobrarPedido(pedido.id, pedido.mesa_id)}
                                        disabled={pedido.estado === 'pendiente' || pedido.estado === 'preparacion'}
                                    >
                                        <DollarSign size={18} /> Registrar Cobro
                                    </button>
                                    {(pedido.estado === 'pendiente' || pedido.estado === 'preparacion') && (
                                        <span className="warn-text">Esperando que se entregue a la mesa</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
