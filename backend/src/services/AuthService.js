const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');

class AuthService {
    async login(username, password) {
        if (!username || !password) {
            const error = new Error('Usuario y contraseña son requeridos');
            error.statusCode = 400;
            throw error;
        }

        const user = await userRepository.findByUsername(username);
        if (!user) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        const hasher = String(user.password).startsWith('$2');
        const validPassword = hasher
            ? await bcrypt.compare(password, user.password)
            : password === user.password;

        if (!validPassword) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        if (!hasher) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userRepository.updatePassword(user.id, hashedPassword);
        }

        const { password: _, ...userData } = user;

        const token = jwt.sign(
            { id: user.id, username: user.username, rol: user.rol },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '8h' }
        );

        return { user: userData, token };
    }
}

module.exports = new AuthService();
