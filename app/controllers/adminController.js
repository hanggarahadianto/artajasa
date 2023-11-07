const Joi = require('joi');
const catchAsync = require('../util/catchAsync');
const {
  User,
  UserRole,
  Role,
  FormatMessage,
  Admin,
  Client,
  AdminClient,
} = require('../../database/models');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { use } = require('../../routes/payment');

const checkUsernameExist = async (v) => {
  const data = await User.findOne({
    where: {
      username: v,
    },
  });

  if (data) {
    throw new Error('Username already exists');
  }
};

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

const adminSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(255)
    .required()
    .external(checkUsernameExist),
  password: Joi.string().min(6).pattern(passwordPattern).required().messages({
    'string.pattern.base':
      'Password must be a combination of uppercase and lowercase letters, and numbers.',
  }),
  status: Joi.string().valid('active', 'deactive').default('active'),
  name: Joi.string().min(3).max(255).required(),
});

exports.addAdmin = catchAsync(async (req, res) => {
  try {
    await adminSchema.validateAsync(req.body, { abortEarly: false });

    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const roleType = 2;

    const user = await User.create({
      id: userId,
      username,
      password: hashedPassword,
      roleId: roleType,
    });

    const userRole = await UserRole.create({
      userId: user.id,
      roleId: roleType,
    });

    const admin = await Admin.create({
      id: user.id,
      userId: user.id,
      name,
    });

    res.status(201).json({
      status: true,
      message: 'Create User Success',
      data: { user, userRole, admin },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

exports.deleteAdmin = catchAsync(async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    res.status(400).json({
      status: false,
      message: 'User not found!',
    });
  } else {
    const data = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    await UserRole.destroy({
      where: {
        userId: req.params.id,
      },
    });

    await Admin.destroy({
      where: {
        userId: req.params.id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'User berhasil dihapus',
      data: data,
    });
  }
});

exports.getAllClientsByAdmin = catchAsync(async (req, res) => {
  try {
    const adminId = req.user.id;

    const clients = await Client.findAll({
      include: [
        {
          model: User,
        },
      ],
    });

    const data = clients.map((e) => {
      return {
        id: e.id,
        username: e.User.username,
        status: e.User.status,
      };
    });

    res.status(200).json({
      message: `Get All Clients`,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
