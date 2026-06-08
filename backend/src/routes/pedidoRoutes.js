const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/activos', authMiddleware, pedidoController.getActivos);
router.get('/por-cobrar', authMiddleware, roleMiddleware(['cajero', 'admin']), pedidoController.getPorCobrar);
router.post('/', authMiddleware, roleMiddleware(['mesero', 'admin']), pedidoController.crear);
router.put('/:id/estado', authMiddleware, roleMiddleware(['cocina', 'admin']), pedidoController.cambiarEstado);
router.post('/:id/pagar', authMiddleware, roleMiddleware(['cajero', 'admin']), pedidoController.pagar);

module.exports = router;
