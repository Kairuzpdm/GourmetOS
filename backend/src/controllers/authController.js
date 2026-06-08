const authService = require('../services/AuthService');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json({
            message: 'Login exitoso',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { login };
