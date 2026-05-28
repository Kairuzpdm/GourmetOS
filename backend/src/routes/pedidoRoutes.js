const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/activos', pedidoController.getActivos);
router.get('/por-cobrar', pedidoController.getPorCobrar);
router.post('/', pedidoController.crear);
router.put('/:id/estado', pedidoController.cambiarEstado);
router.post('/:id/pagar', pedidoController.pagar);

module.exports = router;
