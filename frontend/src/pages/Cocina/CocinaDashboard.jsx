import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import './CocinaDashboard.css';
import { LogOut, ChefHat, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CocinaDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);

    const fetchPedidos = async () => {
        try {
            const res = await api.get('/pedidos/activos');
            setPedidos(res.data);
        } catch (error) {
            console.error('Error fetching pedidos', error);
        }
    };

    useEffect(() => {
        fetchPedidos();
        // Polling cada 2 segundos para actualización en tiempo real
        const interval = setInterval(fetchPedidos, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cambiarEstadoPedido = async (id, nuevoEstado) => {
        try {
            await api.put(`/pedidos/${id}/estado`, { estado: nuevoEstado });
            fetchPedidos();
        } catch (error) {
            alert('Error actualizando pedido');
        }
    };

    return (
        <div className="cocina-layout">
            <header className="cocina-header">
                <div className="brand">
                    <ChefHat size={32} className="accent-icon" />
                    <h2>Gourmet<span className="accent">OS</span> Cocina</h2>
                </div>
                <div className="user-section">
                    <span>Chef {user?.nombre}</span>
                    <button className="btn-icon" onClick={handleLogout}><LogOut size={18} /></button>
                </div>
            </header>

            <main className="cocina-content">
                <div className="pedidos-grid">
                    {pedidos.length === 0 ? (
                        <div className="no-orders">
                            <ChefHat size={48} />
                            <p>No hay pedidos pendientes. ¡Buen trabajo!</p>
                        </div>
                    ) : (
                        pedidos.map(pedido => (
                            <div key={pedido.id} className={`pedido-ticket ${pedido.estado}`}>
                                <div className="ticket-header">
                                    <div className="mesa-info">
                                        <span className="mesa-number">{pedido.numero_mesa}</span>
                                        <span className={`estado-badge ${pedido.estado}`}>{pedido.estado}</span>
                                    </div>
                                    <div className="time-info">
                                        <Clock size={14} />
                                        <span>{new Date(pedido.creado_en).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                                
                                <ul className="ticket-items">
                                    {pedido.detalles.map((item, idx) => (
                                        <li key={idx}>
                                            <span className="item-qty">{item.cantidad}x</span>
                                            <span className="item-name">{item.nombre}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="ticket-actions">
                                    {pedido.estado === 'pendiente' && (
                                        <button 
                                            className="btn-primary" 
                                            onClick={() => cambiarEstadoPedido(pedido.id, 'preparacion')}
                                        >
                                            Empezar Preparación
                                        </button>
                                    )}
                                    {pedido.estado === 'preparacion' && (
                                        <button 
                                            className="btn-success" 
                                            onClick={() => cambiarEstadoPedido(pedido.id, 'listo')}
                                        >
                                            <CheckCircle2 size={18} /> Marcar como Listo
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
