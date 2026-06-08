const db = require('../config/db');

class ProductoRepository {
    async getAll() {
        const [rows] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id
        `);
        return rows;
    }

    async create(data) {
        const { nombre, descripcion, precio, categoria_id } = data;
        const [rows] = await db.query(
            'INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?) RETURNING id',
            [nombre, descripcion, precio, categoria_id]
        );
        return rows[0].id;
    }

    async update(id, data) {
        const { nombre, descripcion, precio, categoria_id, disponible } = data;
        await db.query(
            'UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria_id=?, disponible=? WHERE id=?',
            [nombre, descripcion, precio, categoria_id, disponible ?? 1, id]
        );
    }

    async delete(id) {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
    }
}

module.exports = new ProductoRepository();
