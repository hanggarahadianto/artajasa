module.exports = {
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied!' });
    }
  },
  isClient: (req, res, next) => {
    if (req.user && req.user.role === 'client') {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied!' });
    }
  },
};
