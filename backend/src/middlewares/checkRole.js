const checkRole = (allowedRoles = []) => (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'Forbidden: No tienes permisos' });
  }

  return next();
};

module.exports = checkRole;

