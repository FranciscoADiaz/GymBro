/* global fetch */
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/b20702a8-7c6e-40da-affb-9b2d732f56e4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'authMiddleware.js:protect',message:'token decoded',data:{userId:decoded?.id,role:decoded?.role,gymId:decoded?.gymId,hasGymId:!!decoded?.gymId},timestamp:Date.now(),sessionId:'debug-session',runId:'trainer-issue',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { protect };
