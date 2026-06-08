const pedidoService = require('../services/PedidoService');

const crear = async (req, res, next) => {
    try {
        const { mesa_id, detalles, usuario_id } = req.body;
        
        // Validar que existan detalles
        if (!mesa_id || !detalles || detalles.length === 0) {
            return res.status(400).json({ message: 'Mesa y detalles son requeridos' });
        }
        
        // Validar que cada detalle tenga los campos necesarios
        for (let item of detalles) {
            if (!item.producto_id || !item.cantidad || !item.precio) {
                return res.status(400).json({ 
                    message: `Detalle inválido: ${JSON.stringify(item)}` 
                });
            }
        }
        
        // Si usamos el token JWT, req.user.id tendría el ID del usuario
        const finalUserId = req.user ? req.user.id : (usuario_id || 2);

        const pedidoId = await pedidoService.crear(mesa_id, finalUserId, detalles);
        res.status(201).json({ message: 'Pedido creado', id: pedidoId });
    } catch (error) {
        console.error('Error al crear pedido:', error.message);
        next(error);
    }
};

const getActivos = async (req, res, next) => {
    try {
        const pedidos = await pedidoService.getActivos();
        res.json(pedidos);
    } catch (error) {
        next(error);
    }
};

const cambiarEstado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await pedidoService.cambiarEstado(id, estado);
        res.json({ message: 'Estado actualizado' });
    } catch (error) {
        next(error);
    }
};

const getPorCobrar = async (req, res, next) => {
    try {
        const pedidos = await pedidoService.getPorCobrar();
        res.json(pedidos);
    } catch (error) {
        next(error);
    }
};

const pagar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { mesa_id } = req.body;
        await pedidoService.pagar(id, mesa_id);
        res.json({ message: 'Pedido pagado exitosamente' });
    } catch (error) {
        next(error);
    }
};

module.exports = { crear, getActivos, cambiarEstado, getPorCobrar, pagar };
