const { Router } = require('express');
const { register, login, createStaff } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/staff', protect, createStaff);

module.exports = router;

