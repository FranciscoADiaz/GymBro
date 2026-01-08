const { Router } = require('express');
const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect } = require('../middlewares/authMiddleware');

const router = Router();

router.use(protect);

router.post('/', createMember);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;

