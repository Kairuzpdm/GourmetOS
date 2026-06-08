const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        console.error('❌ No token provided. Auth header:', authHeader);
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        console.log('✅ Token decodificado:', { id: decoded.id, username: decoded.username, rol: decoded.rol });
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ Token error:', error.message);
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        console.log('🔐 Verificando rol. Usuario:', req.user, 'Roles requeridos:', roles);
        if (!req.user || !roles.includes(req.user.rol)) {
            console.error('❌ Acceso denegado. Rol:', req.user?.rol, 'No en:', roles);
            return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios.' });
        }
        console.log('✅ Rol permitido');
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
