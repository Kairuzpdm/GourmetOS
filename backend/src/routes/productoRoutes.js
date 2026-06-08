const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, productoController.getAll);
router.post('/', authMiddleware, roleMiddleware(['admin']), productoController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), productoController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), productoController.remove);

module.exports = router;
