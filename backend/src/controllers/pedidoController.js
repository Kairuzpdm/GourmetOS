const Pedido = require('../models/pedidoModel');

const crear = async (req, res) => {
    try {
        const { mesa_id, detalles, usuario_id } = req.body;
        
        const pedidoId = await Pedido.crear(mesa_id, usuario_id || 2, detalles); // Fallback to usuario 2 (mesero test)
        res.status(201).json({ message: 'Pedido creado', id: pedidoId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error creando pedido' });
    }
};

const getActivos = async (req, res) => {
    try {
        const pedidos = await Pedido.getPedidosActivos();
        res.json(pedidos);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error obteniendo pedidos' });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await Pedido.cambiarEstadoPedido(id, estado);
        res.json({ message: 'Estado actualizado' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error actualizando estado' });
    }
};

const getPorCobrar = async (req, res) => {
    try {
        const pedidos = await Pedido.getPedidosPorCobrar();
        res.json(pedidos);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error obteniendo pedidos por cobrar' });
    }
};

const pagar = async (req, res) => {
    try {
        const { id } = req.params;
        const { mesa_id } = req.body;
        await Pedido.pagarPedido(id, mesa_id);
        res.json({ message: 'Pedido pagado exitosamente' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error procesando pago' });
    }
};

module.exports = { crear, getActivos, cambiarEstado, getPorCobrar, pagar };
