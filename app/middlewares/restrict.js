const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  auth: (req, res, next) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: 'You are not authorize!',
          data: null,
        });
      }

      const decode = jwt.verify(token, JWT_SECRET_KEY);
      req.user = decode;

    if (req.method === 'GET' && req.path.startsWith('/api/users/')) {
      next();
    } else if (req.method === 'PUT' && req.path.startsWith('/api/users/')) {
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
