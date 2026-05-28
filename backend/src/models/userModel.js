const db = require('../config/db');

const User = {
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    },
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = User;
