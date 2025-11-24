module.exports = (allowed = []) => {
  return (req, res, next) => {
    const role = req.user && req.user.role;
    if (!role) return res.status(403).json({ message: 'Forbidden' });
    if (Array.isArray(allowed) && allowed.length && !allowed.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
