import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../services/api';
import './AdminHome.css';
import {
    TrendingUp, ShoppingBag, Coffee, Utensils,
    Clock, CheckCircle2, ChefHat, DollarSign
} from 'lucide-react';

export default function AdminHome() {
    const [reporte, setReporte] = useState({ total_ventas: 0, total_pedidos: 0 });
    const [mesas, setMesas] = useState([]);
    const [pedidosActivos, setPedidosActivos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        try {
            const [rep, mes, ped] = await Promise.all([
                api.get('/reportes/ventas-dia'),
                api.get('/mesas'),
                api.get('/pedidos/activos')
            ]);
            setReporte(rep.data || {});
            setMesas(mes.data || []);
            setPedidosActivos(ped.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        const interval = setInterval(fetchAll, 15000);
        return () => clearInterval(interval);
    }, []);

    const mesasLibres   = mesas.filter(m => m.estado === 'libre').length;
    const mesasOcupadas = mesas.filter(m => m.estado === 'ocupada').length;

    const pendientes   = pedidosActivos.filter(p => p.estado === 'pendiente').length;
    const preparacion  = pedidosActivos.filter(p => p.estado === 'preparacion').length;
    const listos       = pedidosActivos.filter(p => p.estado === 'listo').length;

    const ticketPromedio = reporte.total_pedidos > 0
        ? (reporte.total_ventas / reporte.total_pedidos).toFixed(2)
        : '0.00';

    const fechaHoy = new Date().toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    if (loading) return <div className="admin-home-loading">Cargando resumen...</div>;

    return (
        <div className="admin-home">
            {/* Encabezado */}
            <header className="home-header">
                <div>
                    <h1 className="home-title">Resumen del Día</h1>
                    <p className="home-date">{fechaHoy}</p>
                </div>
                <button className="btn-refresh-sm" onClick={fetchAll}>↻ Actualizar</button>
            </header>

            {/* KPIs de ventas */}
            <section className="kpi-row">
                <div className="kpi-card kpi-green">
                    <div className="kpi-icon"><TrendingUp size={22} /></div>
                    <div className="kpi-body">
                        <span className="kpi-label">Ventas del Día</span>
                        <span className="kpi-value">${Number(reporte.total_ventas || 0).toFixed(2)}</span>
                    </div>
                </div>
                <div className="kpi-card kpi-blue">
                    <div className="kpi-icon kpi-blue"><ShoppingBag size={22} /></div>
                    <div className="kpi-body">
                        <span className="kpi-label">Pedidos Cobrados</span>
                        <span className="kpi-value">{reporte.total_pedidos || 0}</span>
                    </div>
                </div>
                <div className="kpi-card kpi-purple">
                    <div className="kpi-icon kpi-purple"><DollarSign size={22} /></div>
                    <div className="kpi-body">
                        <span className="kpi-label">Ticket Promedio</span>
                        <span className="kpi-value">${ticketPromedio}</span>
                    </div>
                </div>
                <div className="kpi-card kpi-orange">
                    <div className="kpi-icon kpi-orange"><Coffee size={22} /></div>
                    <div className="kpi-body">
                        <span className="kpi-label">Mesas Ocupadas</span>
                        <span className="kpi-value">{mesasOcupadas} / {mesas.length}</span>
                    </div>
                </div>
            </section>

            <div className="home-grid">
                {/* Estado de Mesas */}
                <section className="home-card">
                    <div className="home-card-header">
                        <Coffee size={18} />
                        <h3>Estado de Mesas</h3>
                    </div>
                    <div className="mesas-wrap">
                        {mesas.map(m => (
                            <div key={m.id} className={`mesa-pill ${m.estado}`}>
                                <span className="mesa-num">{m.numero_mesa}</span>
                                <span className={`mesa-dot ${m.estado}`}></span>
                            </div>
                        ))}
                    </div>
                    <div className="legend-row">
                        <span className="legend libre">● Libre ({mesasLibres})</span>
                        <span className="legend ocupada">● Ocupada ({mesasOcupadas})</span>
                    </div>
                </section>

                {/* Pedidos en curso */}
                <section className="home-card">
                    <div className="home-card-header">
                        <ChefHat size={18} />
                        <h3>Pedidos en Curso</h3>
                        <span className="total-badge">{pedidosActivos.length}</span>
                    </div>
                    <div className="estado-row">
                        <div className="estado-chip pendiente">
                            <Clock size={16} />
                            <span>Pendientes</span>
                            <strong>{pendientes}</strong>
                        </div>
                        <div className="estado-chip preparacion">
                            <Utensils size={16} />
                            <span>En Preparación</span>
                            <strong>{preparacion}</strong>
                        </div>
                        <div className="estado-chip listo">
                            <CheckCircle2 size={16} />
                            <span>Listos</span>
                            <strong>{listos}</strong>
                        </div>
                    </div>

                    {pedidosActivos.length === 0 ? (
                        <p className="empty-msg">No hay pedidos activos en este momento.</p>
                    ) : (
                        <ul className="pedidos-list">
                            {pedidosActivos.slice(0, 5).map(p => (
                                <li key={p.id} className="pedido-row">
                                    <span className="pedido-mesa">{p.numero_mesa}</span>
                                    <span className={`pedido-estado ${p.estado}`}>{p.estado}</span>
                                    <span className="pedido-items">{p.detalles?.length || 0} items</span>
                                </li>
                            ))}
                            {pedidosActivos.length > 5 && (
                                <li className="more-msg">…y {pedidosActivos.length - 5} pedido(s) más</li>
                            )}
                        </ul>
                    )}
                </section>

                {/* Accesos rápidos */}
                <section className="home-card quick-links">
                    <div className="home-card-header">
                        <Utensils size={18} />
                        <h3>Accesos Rápidos</h3>
                    </div>
                    <div className="quick-grid">
                        <NavLink to="/admin/menu" className="quick-btn">
                            <Utensils size={20} />
                            <span>Gestionar Menú</span>
                        </NavLink>
                        <NavLink to="/admin/reporte" className="quick-btn">
                            <TrendingUp size={20} />
                            <span>Ver Reporte</span>
                        </NavLink>
                        <NavLink to="/mesero" className="quick-btn">
                            <Coffee size={20} />
                            <span>Vista Mesero</span>
                        </NavLink>
                        <NavLink to="/cocina" className="quick-btn">
                            <ChefHat size={20} />
                            <span>Vista Cocina</span>
                        </NavLink>
                        <NavLink to="/cajero" className="quick-btn">
                            <DollarSign size={20} />
                            <span>Vista Cajero</span>
                        </NavLink>
                    </div>
                </section>
            </div>
        </div>
    );
}
