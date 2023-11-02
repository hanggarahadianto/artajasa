const Joi = require('joi');
const catchAsync = require('../util/catchAsync');
const { User, UserRole, Role, Token } = require('../../database/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { JWT_SECRET_KEY } = process.env;

exports.loginUser = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
    include: [
      {
        model: UserRole,
        include: Role,
      },
    ],
  });

  if (!user) {
    res.status(404).json({
      status: false,
      message: 'User not found!',
    });
  } else {
    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect) {
      res.status(400).json({
        status: false,
        message: 'Password incorrect',
      });
    } else {
      if (user.status !== 'active') {
        res.status(400).json({
          status: false,
          message: 'Your account has suspended!',
        });
      } else {
        const roles = user.UserRoles.map((userRole) => userRole.Role.roleName);
        payload = {
          id: user.id,
          username: user.username,
          status: user.status,
          role: roles[0],
        };

        const token = jwt.sign(payload, JWT_SECRET_KEY, {
          expiresIn: '2d',
        });

        const tokenData = await Token.create({
          user_id: user.id,
          token: token,
          expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        });

        res.status(201).json({
          status: true,
          message: 'Login success',
          data: {
            token: tokenData.token,
            payload,
          },
        });
      }
    }
  }
});

exports.logout = catchAsync(async (req, res) => {
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(400).json({
      status: false,
      message: 'Token not provided',
    });
  }

  const foundToken = await Token.findOne({ where: { token: token } });
  if (!foundToken || foundToken.revoked) {
    return res.status(400).json({
      status: false,
      message: 'Token not found or already revoked',
    });
  }

  const revokedToken = await Token.update(
    { revoked: true },
    {
      where: {
        token: token,
      },
    },
  );

  if (revokedToken[0] === 0) {
    return res.status(400).json({
      status: false,
      message: 'Token not found or already revoked',
    });
  }

  return res.status(200).json({
    status: true,
    message: 'Token revoked successfully',
  });
});
