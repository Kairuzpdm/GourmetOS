const db = require('../config/db');

class UserRepository {
    async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    }

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }

    async updatePassword(id, hashedPassword) {
        await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);
    }
}

module.exports = new UserRepository();
