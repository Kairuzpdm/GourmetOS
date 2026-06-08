const db = require('../config/db');

class PedidoRepository {
    async crearPedido(mesa_id, usuario_id, estado = 'pendiente') {
        const [rows] = await db.query(
            'INSERT INTO pedidos (mesa_id, usuario_id, estado) VALUES (?, ?, ?) RETURNING id',
            [mesa_id, usuario_id, estado]
        );
        return rows[0].id;
    }

    async addDetalle(pedidoId, producto_id, cantidad, precio_unitario) {
        await db.query(
            'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [pedidoId, producto_id, cantidad, precio_unitario]
        );
    }

    async updateTotal(pedidoId, total) {
        await db.query('UPDATE pedidos SET total = ? WHERE id = ?', [total, pedidoId]);
    }

    async getActivos() {
        const [rows] = await db.query(`
            SELECT p.id, m.numero_mesa, p.estado, p.creado_en 
            FROM pedidos p
            JOIN mesas m ON p.mesa_id = m.id
            WHERE p.estado IN ('pendiente', 'preparacion', 'listo')
            ORDER BY p.creado_en ASC
        `);
        return rows;
    }

    async getDetallesByPedidoId(pedidoId) {
        const [detalles] = await db.query(`
            SELECT dp.id, pr.nombre, dp.cantidad, dp.estado 
            FROM detalle_pedidos dp
            JOIN productos pr ON dp.producto_id = pr.id
            WHERE dp.pedido_id = ?
        `, [pedidoId]);
        return detalles;
    }

    async updateEstado(id, estado) {
        await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    }

    async getPorCobrar() {
        const [rows] = await db.query(`
            SELECT p.id, m.numero_mesa, m.id as mesa_id, p.estado, p.total, p.creado_en 
            FROM pedidos p
            JOIN mesas m ON p.mesa_id = m.id
            WHERE p.estado IN ('listo', 'entregado')
            ORDER BY p.creado_en ASC
        `);
        return rows;
    }

    async getConnection() {
        return await db.getConnection();
    }
}

module.exports = new PedidoRepository();
