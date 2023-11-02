const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const { Token } = require('../../database/models');

module.exports = {
  auth: async (req, res, next) => {
    try {
      const authorizationHeader = req.headers['authorization'];
      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: false,
          message: 'You are not authorized!',
          data: null,
        });
      }

      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: 'You are not authorized!',
          data: null,
        });
      }

      const decodedToken = jwt.verify(token, JWT_SECRET_KEY);

      const foundToken = await Token.findOne({
        where: { token: token, revoked: true },
      });

      if (foundToken) {
        return res.status(401).json({
          status: false,
          message: 'Token expired. Please log in again.',
          data: null,
        });
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      if (err.message == 'jwt malformed') {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: false,
          message: 'Token has expired. Please log in again.',
          data: null,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: err.message,
          data: null,
        });
      }
    }
  },
};
