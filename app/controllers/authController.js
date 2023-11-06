const Joi = require('joi');
const catchAsync = require('../util/catchAsync');
const { User, UserRole, Role } = require('../../database/models');
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

        const tokenData = await User.update(
          {
            token: token,
          },
          {
            where: {
              id: user.id,
            },
          },
        );

        res.status(201).json({
          status: true,
          message: 'Login success',
          data: {
            token: token,
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

  const foundToken = await User.findOne({ where: { token: token } });
  if (!foundToken) {
    return res.status(400).json({
      status: false,
      message: 'Token not found',
    });
  }

  const revokedToken = await User.update(
    {
      token: null,
    },

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
