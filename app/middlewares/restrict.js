const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "you're not authorized!",
        data: null,
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;

    if (req.method === 'GET' && req.path.startsWith('/api/users/')) {
      next();
    } else if ((req.method === 'PUT' && req.path.startsWith('/api/users/')) || req.path === '/api/users/self_modify') {
      next();
    } else {
      return res.status(403).json({
        status: false,
        message: 'Permission denied!',
        data: null,
      });
    }
  } catch (err) {
    if (err.message == 'jwt malformed') {
      return res.status(401).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    next(err);
  }
};
