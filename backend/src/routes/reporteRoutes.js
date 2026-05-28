const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/ventas-dia', reporteController.getVentasDelDia);

module.exports = router;
