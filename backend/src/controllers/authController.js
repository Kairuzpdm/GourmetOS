const User = require('../models/userModel');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }

        const user = await User.findByUsername(username);

        // Validacion simple (idealmente usar bcrypt)
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const { password: _, ...userData } = user;

        res.json({
            message: 'Login exitoso',
            user: userData
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    login
};
