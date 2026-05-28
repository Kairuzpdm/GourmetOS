import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import './MeseroDashboard.css';
import { LogOut, ShoppingCart, CheckCircle, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MeseroDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [mesas, setMesas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [carrito, setCarrito] = useState([]);
    
    useEffect(() => {
        fetchMesas();
        fetchProductos();
    }, []);

    const fetchMesas = async () => {
        const res = await api.get('/mesas');
        setMesas(res.data);
    };

    const fetchProductos = async () => {
        const res = await api.get('/productos');
        setProductos(res.data.filter(p => p.disponible));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const agregarAlCarrito = (producto) => {
        if (!mesaSeleccionada) {
            alert('Selecciona una mesa primero');
            return;
        }
        const existe = carrito.find(item => item.producto_id === producto.id);
        if (existe) {
            setCarrito(carrito.map(item => item.producto_id === producto.id ? {...item, cantidad: item.cantidad + 1} : item));
        } else {
            setCarrito([...carrito, { producto_id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }]);
        }
    };

    const enviarPedido = async () => {
        if (carrito.length === 0) return;
        try {
            await api.post('/pedidos', {
                mesa_id: mesaSeleccionada.id,
                detalles: carrito
            });
            alert('Pedido enviado a cocina');
            setCarrito([]);
            setMesaSeleccionada(null);
            fetchMesas(); // Actualizar estado de las mesas
        } catch (error) {
            alert('Error al enviar pedido');
        }
    };

    const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    return (
        <div className="mesero-layout">
            <header className="mesero-header">
                <div className="brand">
                    <h2>Gourmet<span className="accent">OS</span></h2>
                    <span className="role-badge">Mesero</span>
                </div>
                <div className="user-section">
                    <span>Hola, {user?.nombre}</span>
                    <button className="btn-icon" onClick={handleLogout}><LogOut size={18} /></button>
                </div>
            </header>

            <main className="mesero-content">
                <section className="mesas-section">
                    <h3>Mesas</h3>
                    <div className="mesas-grid">
                        {mesas.map(mesa => (
                            <div 
                                key={mesa.id} 
                                className={`mesa-card ${mesa.estado} ${mesaSeleccionada?.id === mesa.id ? 'selected' : ''}`}
                                onClick={() => {
                                    if(mesa.estado === 'libre') setMesaSeleccionada(mesa)
                                    else alert('La mesa ya está ocupada. Funcionalidad de editar pedido en construcción.')
                                }}
                            >
                                <Coffee size={24} />
                                <span>{mesa.numero_mesa}</span>
                                <span className="estado">{mesa.estado}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="menu-section">
                    <h3>Menú</h3>
                    <div className="productos-grid">
                        {productos.map(prod => (
                            <div key={prod.id} className="producto-card" onClick={() => agregarAlCarrito(prod)}>
                                <span className="prod-name">{prod.nombre}</span>
                                <span className="prod-price">${prod.precio}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="carrito-section">
                    <div className="carrito-header">
                        <h3><ShoppingCart size={20} /> Pedido Actual</h3>
                        {mesaSeleccionada && <span className="mesa-badge">{mesaSeleccionada.numero_mesa}</span>}
                    </div>
                    
                    <div className="carrito-items">
                        {carrito.length === 0 ? (
                            <p className="empty-cart">Selecciona productos para agregar al pedido</p>
                        ) : (
                            carrito.map((item, idx) => (
                                <div key={idx} className="cart-item">
                                    <div className="item-info">
                                        <span className="item-qty">{item.cantidad}x</span>
                                        <span className="item-name">{item.nombre}</span>
                                    </div>
                                    <span className="item-total">${(item.precio * item.cantidad).toFixed(2)}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="carrito-footer">
                        <div className="total-row">
                            <span>Total</span>
                            <span className="total-amount">${totalCarrito.toFixed(2)}</span>
                        </div>
                        <button 
                            className="btn-primary w-100" 
                            disabled={carrito.length === 0 || !mesaSeleccionada}
                            onClick={enviarPedido}
                        >
                            <CheckCircle size={18} /> Enviar a Cocina
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}
