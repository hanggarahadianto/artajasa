const Joi = require('joi');
const {
  User,
  UserRole,
  Admin,
  Client,
  FormatMessage,
  Role,
  ClientHasAdmin,
} = require('../../database/models');
const catchAsync = require('../util/catchAsync');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

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

const userSchema = Joi.object({
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
  roleId: Joi.required(),
  name: Joi.string(),
  formatMessageId: Joi.number(),
  adminId: Joi.string(),
});

exports.addUser = catchAsync(async (req, res) => {
  try {
    await userSchema.validateAsync(req.body, { abortEarly: false });

    const { username, password, roleId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    let user;
    let userRole;
    let client;
    let admin;

    if (roleId === 2) {
      const { name, formatMessageId } = req.body;
      if (!name || !formatMessageId) {
        return res.status(400).json({
          status: false,
          message: 'Name and formatMessageId are required for role 2.',
        });
      }

      user = await User.create({
        id: userId,
        username,
        password: hashedPassword,
        roleId,
      });

      // Further logic for role 2
    } else if (roleId === 3) {
      const clientId = uuidv4();
      const { formatMessageId, adminId } = req.body;
      if (!formatMessageId) {
        res.status(400).json({
          status: false,
          message: 'formatMessageId is required',
        });
      } else if (!adminId) {
        res.status(400).json({
          status: false,
          message: 'adminId is required',
        });
      } else {
        client = await Client.create({
          id: clientId,
          formatMessageId,
          userId: user.id,
        });

        const clientHasAdmin = await ClientHasAdmin.create({
          clientId: client.id,
          adminId,
        });

        userRole = await UserRole.create({ userId: user.id, roleId });

        res.status(201).json({
          status: true,
          message: 'User Berhasil Dibuat',
          data: { user, userRole, client, clientHasAdmin },
        });
      }

      user = await User.create({
        id: userId,
        username,
        password: hashedPassword,
        roleId,
      });

      // Further logic for role 3
    } else {
      user = await User.create({
        id: userId,
        username,
        password: hashedPassword,
        roleId,
      });

      // Further logic for other roles
    }

    // Sending success response
    res.status(201).json({
      status: true,
      message: 'Create User Success',
      data: { user, userRole, client, admin },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, username = '' } = req.query;
  const offset = (page - 1) * limit;

  const whereCondition = {};
  if (username) {
    whereCondition['$User.username$'] = { [Op.like]: `%${username}%` };
  }

  const users = await UserRole.findAndCountAll({
    include: [{ model: User }, { model: Role }],
    where: whereCondition,
    limit: parseInt(limit),
    offset: offset,
  });

  if (users.rows.length <= 0) {
    return res.status(404).json({
      status: false,
      message: 'Data not found!',
    });
  }

  const data = users.rows.map((e) => {
    return {
      id: e.User.id,
      username: e.User.username,
      role: e.Role.roleName,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  });

  res.status(200).json({
    status: true,
    message: 'Success Get Admin',
    currentPage: page,
    totalItems: users.count,
    totalPages: Math.ceil(users.count / limit),
    data,
  });
});

exports.getAllAdmin = catchAsync(async (req, res) => {
  const admin = await UserRole.findAll({
    where: {
      roleId: 2,
    },
    include: [
      {
        model: User,
        include: [
          {
            model: Admin,
            as: 'admin',
          },
        ],
      },
      {
        model: Role,
      },
    ],
  });

  if (admin.length <= 0) {
    res.status(404).json({
      status: false,
      message: 'Data not found!',
    });
  } else {
    const data = admin.map((e) => {
      return {
        id: e.User.id,
        username: e.User.username,
        role: e.Role.roleName,
        name: e.User.admin[0].name,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
    });
    res.status(200).json({
      status: true,
      message: 'Success Get Admin',
      data,
    });
  }
});

exports.searchUser = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, username = '' } = req.query;
  const offset = (page - 1) * limit;

  const users = await User.findAndCountAll({
    where: {
      username: {
        [Op.like]: `%${username}%`,
      },
    },
    limit: parseInt(limit),
    offset: offset,
  });

  res.status(200).json({
    status: true,
    message: 'User search results',
    data: users.rows,
    total: users.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
});
exports.terUser = terUser = catchAsync(async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    res.status(404).json({
      status: false,
      message: 'User not found! nih',
    });
  } else {
    user.status = 'deactive';
    await user.save();

    res.status(200).json({
      status: true,
      message: 'User status updated successfully',
      data: user,
    });
  }
});

exports.modifyUser = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      id: req.params.user_id,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'User not found!',
    });
  } else {
    if (!username && !password) {
      return res.status(400).json({
        status: false,
        message:
          'You must provide either a new username or password to update.',
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.update(
        {
          username,
          password: hashedPassword,
        },
        {
          where: {
            id: req.params.user_id,
          },
        },
      );

      res.status(200).json({
        status: true,
        message: 'User updated successfully',
      });
    }
  }
});
exports.selfModify = catchAsync(async (req, res) => {
  const user = req.user.id;

  if (!user) {
    return res.status(401).json({
      status: false,
      message: 'Pengguna tidak ditemukan',
    });
  }

  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedData = await User.update(
    {
      password: hashedPassword,
    },
    {
      where: {
        id: req.user.id,
      },
    },
  );

  res.status(200).json({
    status: true,
    message: 'Data pengguna berhasil dimodifikasi',
    data: updatedData,
  });
});
exports.deleteUser = catchAsync(async (req, res) => {
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

    res.status(200).json({
      status: true,
      message: 'User berhasil dihapus',
      data: data,
    });
  }
});
exports.whoami = catchAsync(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    status: true,
    message: 'succes',
    data: user,
  });
});
