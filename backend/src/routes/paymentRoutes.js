const { Router } = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createPayment } = require('../controllers/paymentController');

const router = Router();

router.use(protect);

router.post('/', createPayment);

module.exports = router;

