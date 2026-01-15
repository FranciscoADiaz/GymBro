const { Router } = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { regenerateInviteCode, getInviteCode } = require('../controllers/gymController');

const router = Router();

router.use(protect);

router.get('/invite-code', getInviteCode);
router.post('/invite-code', regenerateInviteCode);

module.exports = router;

