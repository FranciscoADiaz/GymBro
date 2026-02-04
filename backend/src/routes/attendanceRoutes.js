const { Router } = require('express');
const { protect } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const { checkIn } = require('../controllers/attendanceController');

const router = Router();

router.use(protect);
router.use(checkRole(['admin', 'recepcion', 'entrenador']));

router.post('/check-in', checkIn);

module.exports = router;

