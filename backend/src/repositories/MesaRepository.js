const db = require('../config/db');

class MesaRepository {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM mesas ORDER BY numero_mesa');
        return rows;
    }

    async create(numero_mesa) {
        const [rows] = await db.query('INSERT INTO mesas (numero_mesa) VALUES (?) RETURNING id', [numero_mesa]);
        return rows[0].id;
    }

    async update(id, numero_mesa) {
        await db.query('UPDATE mesas SET numero_mesa = ? WHERE id = ?', [numero_mesa, id]);
    }

    async delete(id) {
        await db.query('DELETE FROM mesas WHERE id = ?', [id]);
    }

    async updateEstado(id, estado) {
        await db.query('UPDATE mesas SET estado = ? WHERE id = ?', [estado, id]);
    }
}

module.exports = new MesaRepository();
