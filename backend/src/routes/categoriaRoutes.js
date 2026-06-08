const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, categoriaController.getAll);
router.post('/', authMiddleware, roleMiddleware(['admin']), categoriaController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), categoriaController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), categoriaController.remove);

module.exports = router;
