const { Router } = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  createMembership,
  getAllMemberships,
  deleteMembership,
} = require('../controllers/membershipController');

const router = Router();

router.use(protect);

router.post('/', createMembership);
router.get('/', getAllMemberships);
router.delete('/:id', deleteMembership);

module.exports = router;

