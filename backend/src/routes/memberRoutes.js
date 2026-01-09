const { Router } = require('express');
const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect } = require('../middlewares/authMiddleware');
const { validateMember } = require('../middlewares/validators/memberValidator');

const router = Router();

router.use(protect);

router.post('/', validateMember, createMember);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.put('/:id', validateMember, updateMember);
router.delete('/:id', deleteMember);

module.exports = router;

