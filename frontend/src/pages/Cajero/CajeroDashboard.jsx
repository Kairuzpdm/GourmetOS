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
            console.log('📥 Obteniendo datos del cajero...');
            const [pedidosRes, reporteRes] = await Promise.all([
                api.get('/pedidos/por-cobrar'),
                api.get('/reportes/ventas-dia')
            ]);
            console.log('✅ Pedidos por cobrar:', pedidosRes.data);
            console.log('✅ Reporte:', reporteRes.data);
            setPedidos(pedidosRes.data);
            setReporte(reporteRes.data || { total_ventas: 0, total_pedidos: 0 });
        } catch (error) {
            console.error('❌ Error fetching cajero data:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        console.log('🔐 Cajero logueado como:', user);
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cobrarPedido = async (ids, mesa_id) => {
        if (!window.confirm('¿Confirmar cobro y liberar mesa?')) return;
        try {
            for (const id of ids) {
                await api.post(`/pedidos/${id}/pagar`, { mesa_id });
            }
            alert('Cobro registrado. Mesa liberada.');
            fetchData();
        } catch (error) {
            alert('Error procesando cobro');
        }
    };

    const pedidosAgrupados = pedidos.reduce((acc, pedido) => {
        if (!acc[pedido.numero_mesa]) {
            acc[pedido.numero_mesa] = {
                mesa_id: pedido.mesa_id,
                numero_mesa: pedido.numero_mesa,
                total: 0,
                pedidosIds: [],
                todosListos: true,
                estados: new Set()
            };
        }
        acc[pedido.numero_mesa].total += parseFloat(pedido.total);
        acc[pedido.numero_mesa].pedidosIds.push(pedido.id);
        if (pedido.estado !== 'listo') {
            acc[pedido.numero_mesa].todosListos = false;
        }
        acc[pedido.numero_mesa].estados.add(pedido.estado);
        return acc;
    }, {});

    const agrupadosArr = Object.values(pedidosAgrupados);

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
                            <span className="report-value">Bs {reporte.total_ventas || '0.00'}</span>
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
                        {agrupadosArr.length === 0 ? (
                            <p className="empty-msg">No hay pedidos pendientes de cobro.</p>
                        ) : (
                            agrupadosArr.map(grupo => (
                                <div key={grupo.numero_mesa} className="cobro-card">
                                    <div className="cobro-header">
                                        <span className="mesa">{grupo.numero_mesa}</span>
                                        <span className={`estado-badge ${grupo.todosListos ? 'listo' : 'pendiente'}`}>
                                            {Array.from(grupo.estados).join(', ')}
                                        </span>
                                    </div>
                                    <div className="cobro-body">
                                        <span className="total-label">Total a Pagar</span>
                                        <span className="total-monto">Bs {grupo.total.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        className="btn-primary w-100" 
                                        onClick={() => cobrarPedido(grupo.pedidosIds, grupo.mesa_id)}
                                        disabled={!grupo.todosListos}
                                    >
                                        <DollarSign size={18} /> Registrar Cobro
                                    </button>
                                    {!grupo.todosListos && (
                                        <span className="warn-text">Faltan pedidos de cocina</span>
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
