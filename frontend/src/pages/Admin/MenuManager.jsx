import { useState, useEffect } from 'react';
import api from '../../services/api';
import './MenuManager.css';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

// ─── Modal genérico ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="btn-icon" onClick={onClose}><X size={18} /></button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

// ─── Formulario de Categoría ─────────────────────────────────────────────────
function CategoriaForm({ initial, onSave, onClose }) {
    const [nombre, setNombre] = useState(initial?.nombre || '');
    const [descripcion, setDescripcion] = useState(initial?.descripcion || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        setLoading(true);
        try {
            if (initial) {
                await api.put(`/categorias/${initial.id}`, { nombre, descripcion });
            } else {
                await api.post('/categorias', { nombre, descripcion });
            }
            onSave();
            onClose();
        } catch {
            alert('Error al guardar la categoría');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <div className="input-group">
                <label>Nombre *</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Entradas" required />
            </div>
            <div className="input-group">
                <label>Descripción</label>
                <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción opcional" />
            </div>
            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : (initial ? 'Actualizar' : 'Crear Categoría')}
                </button>
            </div>
        </form>
    );
}

// ─── Formulario de Producto ─────────────────────────────────────────────────
function ProductoForm({ initial, categorias, onSave, onClose }) {
    const [form, setForm] = useState({
        nombre: initial?.nombre || '',
        descripcion: initial?.descripcion || '',
        precio: initial?.precio || '',
        categoria_id: initial?.categoria_id || '',
        disponible: initial?.disponible ?? 1,
    });
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre.trim() || !form.precio) return;
        setLoading(true);
        try {
            if (initial) {
                await api.put(`/productos/${initial.id}`, form);
            } else {
                await api.post('/productos', form);
            }
            onSave();
            onClose();
        } catch {
            alert('Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <div className="input-group">
                <label>Nombre *</label>
                <input value={form.nombre} onChange={set('nombre')} placeholder="Ej. Hamburguesa Clásica" required />
            </div>
            <div className="form-row">
                <div className="input-group">
                    <label>Precio *</label>
                    <input type="number" step="0.01" min="0" value={form.precio} onChange={set('precio')} placeholder="0.00" required />
                </div>
                <div className="input-group">
                    <label>Categoría</label>
                    <select value={form.categoria_id} onChange={set('categoria_id')}>
                        <option value="">Sin categoría</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label>Descripción</label>
                <input value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción opcional" />
            </div>
            <div className="input-group">
                <label>Estado</label>
                <select value={form.disponible} onChange={e => setForm(prev => ({...prev, disponible: parseInt(e.target.value)}))}>
                    <option value={1}>Disponible</option>
                    <option value={0}>Agotado</option>
                </select>
            </div>
            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : (initial ? 'Actualizar' : 'Crear Producto')}
                </button>
            </div>
        </form>
    );
}

// ─── Componente Principal ────────────────────────────────────────────────────
export default function MenuManager() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modales
    const [modalProd, setModalProd] = useState(null);  // null | 'new' | productoObj
    const [modalCat, setModalCat] = useState(null);    // null | 'new' | categoriaObj

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias')
            ]);
            setProductos(prodRes.data);
            setCategorias(catRes.data);
        } catch (error) {
            console.error("Error al cargar datos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const deleteProducto = async (id) => {
        if (!window.confirm('¿Eliminar este producto?')) return;
        try {
            await api.delete(`/productos/${id}`);
            fetchData();
        } catch { alert('Error al eliminar'); }
    };

    const deleteCategoria = async (id) => {
        if (!window.confirm('¿Eliminar esta categoría? Los productos quedarán sin categoría.')) return;
        try {
            await api.delete(`/categorias/${id}`);
            fetchData();
        } catch { alert('Error al eliminar'); }
    };

    return (
        <div className="menu-manager">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Gestión de Menú</h1>
                    <p className="page-subtitle">Administra los productos y categorías de tu restaurante</p>
                </div>
                <button className="btn-primary" onClick={() => setModalProd('new')}>
                    <Plus size={18} /> Nuevo Producto
                </button>
            </header>

            <div className="content-grid">
                {/* Columna Categorías */}
                <div className="card">
                    <div className="card-header-flex">
                        <h3>Categorías</h3>
                        <button className="btn-icon" title="Nueva Categoría" onClick={() => setModalCat('new')}>
                            <Plus size={16}/>
                        </button>
                    </div>
                    {loading ? <p style={{color:'#94a3b8'}}>Cargando...</p> : (
                        <ul className="category-list">
                            {categorias.map(cat => (
                                <li key={cat.id} className="list-item">
                                    <span>{cat.nombre}</span>
                                    <div className="action-buttons">
                                        <button className="btn-icon small edit" title="Editar" onClick={() => setModalCat(cat)}>
                                            <Edit2 size={13}/>
                                        </button>
                                        <button className="btn-icon small delete" title="Eliminar" onClick={() => deleteCategoria(cat.id)}>
                                            <Trash2 size={13}/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Columna Productos */}
                <div className="card products-card">
                    <div className="card-header-flex">
                        <h3>Productos Activos</h3>
                    </div>
                    {loading ? <p style={{color:'#94a3b8'}}>Cargando...</p> : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(prod => (
                                        <tr key={prod.id}>
                                            <td>{prod.nombre}</td>
                                            <td>
                                                <span className="badge-category">{prod.categoria_nombre || 'Sin categoría'}</span>
                                            </td>
                                            <td className="price-cell">${prod.precio}</td>
                                            <td>
                                                <span className={`status-badge ${prod.disponible ? 'active' : 'inactive'}`}>
                                                    {prod.disponible ? 'Disponible' : 'Agotado'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-icon small edit" title="Editar" onClick={() => setModalProd(prod)}>
                                                        <Edit2 size={14}/>
                                                    </button>
                                                    <button className="btn-icon small delete" title="Eliminar" onClick={() => deleteProducto(prod.id)}>
                                                        <Trash2 size={14}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Producto */}
            {modalProd !== null && (
                <Modal
                    title={modalProd === 'new' ? 'Nuevo Producto' : `Editar: ${modalProd.nombre}`}
                    onClose={() => setModalProd(null)}
                >
                    <ProductoForm
                        initial={modalProd === 'new' ? null : modalProd}
                        categorias={categorias}
                        onSave={fetchData}
                        onClose={() => setModalProd(null)}
                    />
                </Modal>
            )}

            {/* Modal Categoría */}
            {modalCat !== null && (
                <Modal
                    title={modalCat === 'new' ? 'Nueva Categoría' : `Editar: ${modalCat.nombre}`}
                    onClose={() => setModalCat(null)}
                >
                    <CategoriaForm
                        initial={modalCat === 'new' ? null : modalCat}
                        onSave={fetchData}
                        onClose={() => setModalCat(null)}
                    />
                </Modal>
            )}
        </div>
    );
}
