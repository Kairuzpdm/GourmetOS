const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/ventas-dia', authMiddleware, roleMiddleware(['admin', 'cajero']), reporteController.getVentasDelDia);

module.exports = router;
