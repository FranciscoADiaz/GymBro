const { Router } = require('express');
const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  getMemberStatusByDni
} = require('../controllers/memberController');
const { protect } = require('../middlewares/authMiddleware');
const { validateMemberCreate, validateMemberUpdate } = require('../middlewares/validators/memberValidator');

const router = Router();

router.get('/bot/status/:dni', getMemberStatusByDni);

router.use(protect);

router.post('/', validateMemberCreate, createMember);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.put('/:id', validateMemberUpdate, updateMember);
router.delete('/:id', deleteMember);

module.exports = router;

