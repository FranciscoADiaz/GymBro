const { Router } = require('express');
const { protect } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');
const {
  createMembership,
  getAllMemberships,
  deleteMembership,
} = require('../controllers/membershipController');

const router = Router();

router.use(protect);

router.post('/', checkRole(['admin']), createMembership);
router.get('/', checkRole(['admin', 'entrenador']), getAllMemberships);
router.delete('/:id', checkRole(['admin']), deleteMembership);

module.exports = router;

