const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, mesaController.getAll);
router.post('/', authMiddleware, roleMiddleware(['admin']), mesaController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), mesaController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), mesaController.remove);

module.exports = router;
