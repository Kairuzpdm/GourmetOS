const db = require('../config/db');

class CategoriaRepository {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM categorias');
        return rows;
    }

    async create(nombre, descripcion) {
        const [rows] = await db.query('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?) RETURNING id', [nombre, descripcion]);
        return rows[0].id;
    }

    async update(id, nombre, descripcion) {
        await db.query('UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
    }

    async delete(id) {
        await db.query('DELETE FROM categorias WHERE id = ?', [id]);
    }
}

module.exports = new CategoriaRepository();
