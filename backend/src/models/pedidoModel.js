const db = require('../config/db');

const Pedido = {
    crear: async (mesa_id, usuario_id, detalles) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [pedidoResult] = await connection.query(
                'INSERT INTO pedidos (mesa_id, usuario_id, estado) VALUES (?, ?, ?)',
                [mesa_id, usuario_id, 'pendiente']
            );
            const pedidoId = pedidoResult.insertId;

            await connection.query('UPDATE mesas SET estado = ? WHERE id = ?', ['ocupada', mesa_id]);

            let total = 0;
            for (let item of detalles) {
                total += item.precio * item.cantidad;
                await connection.query(
                    'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.producto_id, item.cantidad, item.precio]
                );
            }

            await connection.query('UPDATE pedidos SET total = ? WHERE id = ?', [total, pedidoId]);

            await connection.commit();
            return pedidoId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
    getPedidosActivos: async () => {
        const [rows] = await db.query(`
            SELECT p.id, m.numero_mesa, p.estado, p.creado_en 
            FROM pedidos p
            JOIN mesas m ON p.mesa_id = m.id
            WHERE p.estado IN ('pendiente', 'preparacion', 'listo')
            ORDER BY p.creado_en ASC
        `);
        
        for (let pedido of rows) {
            const [detalles] = await db.query(`
                SELECT dp.id, pr.nombre, dp.cantidad, dp.estado 
                FROM detalle_pedidos dp
                JOIN productos pr ON dp.producto_id = pr.id
                WHERE dp.pedido_id = ?
            `, [pedido.id]);
            pedido.detalles = detalles;
        }
        return rows;
    },
    cambiarEstadoPedido: async (id, estado) => {
        await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
    },
    getPedidosPorCobrar: async () => {
        const [rows] = await db.query(`
            SELECT p.id, m.numero_mesa, m.id as mesa_id, p.estado, p.total, p.creado_en 
            FROM pedidos p
            JOIN mesas m ON p.mesa_id = m.id
            WHERE p.estado != 'pagado'
            ORDER BY p.creado_en ASC
        `);
        return rows;
    },
    pagarPedido: async (id, mesa_id) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('UPDATE pedidos SET estado = ? WHERE id = ?', ['pagado', id]);
            await connection.query('UPDATE mesas SET estado = ? WHERE id = ?', ['libre', mesa_id]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = Pedido;
