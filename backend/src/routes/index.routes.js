const { Router } = require('express');
const { protect } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/secure-check', protect, (_req, res) => {
  res.json({ status: 'secured route ready' });
});

module.exports = router;
