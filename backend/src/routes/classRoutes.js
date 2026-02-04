const { Router } = require('express');
const { protect } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const { createClass, getAllClasses, deleteClass } = require('../controllers/classController');

const router = Router();

router.use(protect);
router.use(checkRole(['admin']));

router.post('/', createClass);
router.get('/', getAllClasses);
router.delete('/:id', deleteClass);

module.exports = router;

