const db = require('../config/db');

class ReporteRepository {
    async getVentasDelDia() {
        const [rows] = await db.query(`
            SELECT SUM(total) as total_ventas, COUNT(id) as total_pedidos
            FROM pedidos
            WHERE estado = 'pagado' AND DATE(creado_en) = CURRENT_DATE
        `);
        return rows[0];
    }
}

module.exports = new ReporteRepository();
