const pedidoRepository = require('../repositories/PedidoRepository');
const mesaRepository = require('../repositories/MesaRepository');

class PedidoService {
    async crear(mesa_id, usuario_id, detalles) {
        const connection = await pedidoRepository.getConnection();
        try {
            await connection.beginTransaction();

            const [pedidoRows] = await connection.query(
                'INSERT INTO pedidos (mesa_id, usuario_id, estado) VALUES (?, ?, ?) RETURNING id',
                [mesa_id, usuario_id, 'pendiente']
            );
            const pedidoId = pedidoRows[0].id;

            await connection.query('UPDATE mesas SET estado = ? WHERE id = ?', ['ocupada', mesa_id]);

            let total = 0;
            for (let item of detalles) {
                if (!item.producto_id || !item.cantidad || !item.precio) {
                    throw new Error(`Detalle de pedido inválido: ${JSON.stringify(item)}`);
                }
                
                const cantidad = parseInt(item.cantidad);
                const precio = parseFloat(item.precio);
                
                if (isNaN(cantidad) || isNaN(precio)) {
                    throw new Error(`Cantidad o precio inválido para producto ${item.producto_id}`);
                }
                
                total += precio * cantidad;
                await connection.query(
                    'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.producto_id, cantidad, precio]
                );
            }

            await connection.query('UPDATE pedidos SET total = ? WHERE id = ?', [total, pedidoId]);

            await connection.commit();
            return pedidoId;
        } catch (error) {
            await connection.rollback();
            console.error('Error en PedidoService.crear:', error.message);
            throw error;
        } finally {
            connection.release();
        }
    }

    async getActivos() {
        const pedidos = await pedidoRepository.getActivos();
        for (let pedido of pedidos) {
            pedido.detalles = await pedidoRepository.getDetallesByPedidoId(pedido.id);
        }
        return pedidos;
    }

    async cambiarEstado(id, estado) {
        await pedidoRepository.updateEstado(id, estado);
    }

    async getPorCobrar() {
        return await pedidoRepository.getPorCobrar();
    }

    async pagar(id, mesa_id) {
        const connection = await pedidoRepository.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('UPDATE pedidos SET estado = ? WHERE id = ?', ['pagado', id]);
            const [activeOrders] = await connection.query("SELECT id FROM pedidos WHERE mesa_id = ? AND estado NOT IN ('pagado', 'cancelado')", [mesa_id]);
            if (activeOrders.length === 0) {
                await connection.query('UPDATE mesas SET estado = ? WHERE id = ?', ['libre', mesa_id]);
            }
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new PedidoService();
