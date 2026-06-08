import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMesas } from '../../hooks/useMesas';
import { useProductos } from '../../hooks/useProductos';
import { usePedidos } from '../../hooks/usePedidos';
import './MeseroDashboard.css';
import { LogOut, ShoppingCart, CheckCircle, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MeseroDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    
    const { mesas, loading: loadingMesas, refetch: refetchMesas } = useMesas();
    const { productos, loading: loadingProductos } = useProductos(true);
    const { crearPedido, loading: enviandoPedido } = usePedidos();

    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [carrito, setCarrito] = useState([]);

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
            await crearPedido(mesaSeleccionada.id, carrito);
            alert('Pedido enviado a cocina');
            setCarrito([]);
            setMesaSeleccionada(null);
            refetchMesas(); // Actualizar estado de las mesas
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Error al enviar pedido';
            console.error('Error enviando pedido:', errorMsg);
            alert('Error al enviar pedido: ' + errorMsg);
        }
    };

    const quitarDelCarrito = (productoId) => {
        setCarrito(prev => prev.reduce((acc, item) => {
            if (item.producto_id !== productoId) {
                acc.push(item);
            } else if (item.cantidad > 1) {
                acc.push({ ...item, cantidad: item.cantidad - 1 });
            }
            return acc;
        }, []));
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
                    {loadingMesas ? <p>Cargando mesas...</p> : (
                        <div className="mesas-grid">
                            {mesas.map(mesa => (
                                <div 
                                    key={mesa.id} 
                                    className={`mesa-card ${mesa.estado} ${mesaSeleccionada?.id === mesa.id ? 'selected' : ''}`}
                                    onClick={() => setMesaSeleccionada(mesa)}
                                >
                                    <Coffee size={24} />
                                    <span>{mesa.numero_mesa}</span>
                                    <span className="estado">{mesa.estado}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="menu-section">
                    <h3>Menú</h3>
                    {loadingProductos ? <p>Cargando menú...</p> : (
                        <div className="menu-categorias">
                            {Object.entries(
                                productos.reduce((acc, prod) => {
                                    const categoria = prod.categoria_nombre || 'Sin categoría';
                                    if (!acc[categoria]) acc[categoria] = [];
                                    acc[categoria].push(prod);
                                    return acc;
                                }, {})
                            ).map(([categoria, prods]) => (
                                <div key={categoria} className="categoria-grupo">
                                    <h4 className="categoria-nombre">{categoria}</h4>
                                    <div className="productos-grid">
                                        {prods.map(prod => (
                                            <div key={prod.id} className="producto-card" onClick={() => agregarAlCarrito(prod)}>
                                                <span className="prod-name">{prod.nombre}</span>
                                                <span className="prod-price">Bs {prod.precio}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                                    <div className="item-actions">
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => quitarDelCarrito(item.producto_id)}
                                        >
                                            - 1
                                        </button>
                                        <span className="item-total">Bs {(item.precio * item.cantidad).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="carrito-footer">
                        <div className="total-row">
                            <span>Total</span>
                            <span className="total-amount">Bs {totalCarrito.toFixed(2)}</span>
                        </div>
                        <button 
                            className="btn-primary w-100" 
                            disabled={carrito.length === 0 || !mesaSeleccionada || enviandoPedido}
                            onClick={enviarPedido}
                        >
                            <CheckCircle size={18} /> {enviandoPedido ? 'Enviando...' : 'Enviar a Cocina'}
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}
