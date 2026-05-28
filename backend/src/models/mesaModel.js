const db = require('../config/db');

const Mesa = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM mesas ORDER BY numero_mesa');
        return rows;
    },
    create: async (numero_mesa) => {
        const [result] = await db.query('INSERT INTO mesas (numero_mesa) VALUES (?)', [numero_mesa]);
        return result.insertId;
    },
    update: async (id, numero_mesa) => {
        await db.query('UPDATE mesas SET numero_mesa = ? WHERE id = ?', [numero_mesa, id]);
    },
    delete: async (id) => {
        await db.query('DELETE FROM mesas WHERE id = ?', [id]);
    },
    updateEstado: async (id, estado) => {
        await db.query('UPDATE mesas SET estado = ? WHERE id = ?', [estado, id]);
    }
};

module.exports = Mesa;
