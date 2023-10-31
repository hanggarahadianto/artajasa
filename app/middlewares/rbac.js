module.exports = {
  isSuperAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'SuperAdmin') {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied!' });
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied!' });
    }
  },
  isClient: (req, res, next) => {
    if (req.user && req.user.role === 'Client') {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied!' });
    }
  },
};
