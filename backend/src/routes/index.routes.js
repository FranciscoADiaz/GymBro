const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/secure-check', authMiddleware, (_req, res) => {
  res.json({ status: 'secured route ready' });
});

module.exports = router;
