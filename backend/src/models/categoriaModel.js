const db = require('../config/db');

const Categoria = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM categorias');
        return rows;
    },
    create: async (nombre, descripcion) => {
        const [result] = await db.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
        return result.insertId;
    },
    update: async (id, nombre, descripcion) => {
        await db.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
    },
    delete: async (id) => {
        await db.query('DELETE FROM categorias WHERE id = ?', [id]);
    }
};

module.exports = Categoria;
