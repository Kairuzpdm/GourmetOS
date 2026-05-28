const db = require('../config/db');

const Producto = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id
        `);
        return rows;
    },
    create: async (data) => {
        const { nombre, descripcion, precio, categoria_id } = data;
        const [result] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, precio, categoria_id]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { nombre, descripcion, precio, categoria_id, disponible } = data;
        await db.query(
            'UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria_id=?, disponible=? WHERE id=?',
            [nombre, descripcion, precio, categoria_id, disponible ?? 1, id]
        );
    },
    delete: async (id) => {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
    }
};

module.exports = Producto;
