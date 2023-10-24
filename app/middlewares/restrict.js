const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  auth: (req, res, next) => {
    try {
      const authorizationHeader = req.headers['authorization'];
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: false,
          message: 'You are not authorized!',
          data: null,
        });
      } else {
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({
            status: false,
            message: 'You are not authorize!',
            data: null,
          });
        }

        const decode = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decode;

        next();
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
  },
};
