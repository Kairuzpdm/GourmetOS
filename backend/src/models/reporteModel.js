const db = require('../config/db');

const Reporte = {
    getVentasDelDia: async () => {
        const [rows] = await db.query(`
            SELECT SUM(total) as total_ventas, COUNT(id) as total_pedidos
            FROM pedidos
            WHERE estado = 'pagado' AND DATE(creado_en) = CURDATE()
        `);
        return rows[0];
    }
};

module.exports = Reporte;
