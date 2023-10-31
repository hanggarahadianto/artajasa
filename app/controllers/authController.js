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
    const isPassCorrect = bcrypt.compare(password, user.password);

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
