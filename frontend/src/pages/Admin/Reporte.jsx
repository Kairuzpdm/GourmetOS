import { useState, useEffect } from 'react';
import api from '../../services/api';
import './Reporte.css';
import { TrendingUp, ShoppingBag, BarChart2 } from 'lucide-react';

export default function Reporte() {
    const [reporte, setReporte] = useState({ total_ventas: 0, total_pedidos: 0 });
    const [loading, setLoading] = useState(true);

    const fetchReporte = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reportes/ventas-dia');
            setReporte(res.data || { total_ventas: 0, total_pedidos: 0 });
        } catch (error) {
            console.error('Error obteniendo reporte', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReporte();
    }, []);

    const fechaHoy = new Date().toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="reporte-page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Reporte de Ventas</h1>
                    <p className="page-subtitle capitalize">{fechaHoy}</p>
                </div>
                <button className="btn-refresh" onClick={fetchReporte}>
                    Actualizar
                </button>
            </header>

            {loading ? (
                <p style={{ color: '#94a3b8' }}>Cargando reporte...</p>
            ) : (
                <div className="kpis-grid">
                    <div className="kpi-card green">
                        <div className="kpi-icon">
                            <TrendingUp size={28} />
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Total Recaudado Hoy</span>
                            <span className="kpi-value">
                                Bs {Number(reporte.total_ventas || 0).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="kpi-card blue">
                        <div className="kpi-icon blue">
                            <ShoppingBag size={28} />
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Pedidos Cobrados Hoy</span>
                            <span className="kpi-value">{reporte.total_pedidos || 0}</span>
                        </div>
                    </div>

                    <div className="kpi-card purple">
                        <div className="kpi-icon purple">
                            <BarChart2 size={28} />
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-label">Ticket Promedio</span>
                            <span className="kpi-value">
                                Bs {reporte.total_pedidos > 0
                                    ? (reporte.total_ventas / reporte.total_pedidos).toFixed(2)
                                    : '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
