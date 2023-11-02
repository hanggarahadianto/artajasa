const Joi = require('joi');
const {
  User,
  UserRole,
  Admin,
  Client,
  FormatMessage,
  Role,
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
  name: Joi.string().required(),
});

exports.addUser = catchAsync(async (req, res) => {
  try {
    await userSchema.validateAsync(req.body, { abortEarly: false });

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
      id: uuidv4(),
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

exports.getAllUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, username = '' } = req.query;
  const offset = (page - 1) * limit;

  const whereCondition = {};
  if (username) {
    whereCondition['$username$'] = { [Op.like]: `%${username}%` };
  }

  const users = await User.findAndCountAll({
    include: [
      {
        model: UserRole,
        include: [{ model: Role }],
        where: {
          roleId: { [Op.ne]: 1 },
        },
      },
    ],
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
      id: e.id,
      username: e.username,
      status: e.status,
      role: e.UserRoles[0].Role.roleName,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  });

  res.status(200).json({
    status: true,
    message: 'Success All Users',
    currentPage: page,
    totalItems: users.count,
    totalPages: Math.ceil(users.count / limit),
    data,
  });
});

exports.getAllAdmin = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, username = '' } = req.query;
  const offset = (page - 1) * limit;

  const whereCondition = {};
  if (username) {
    whereCondition['$username$'] = { [Op.like]: `%${username}%` };
  }

  const users = await User.findAndCountAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: UserRole,
        include: [{ model: Role }],
        where: {
          roleId: 2,
        },
      },
    ],
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
      id: e.id,
      username: e.username,
      status: e.status,
      role: e.UserRoles[0].Role.roleName,
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

exports.getAllClientByAdmin = catchAsync(async (req, res) => {
  const client = await Client.findAll({
    where: {
      adminId: req.user.id,
    },
    include: [
      {
        model: User,
      },
      { model: FormatMessage },
    ],
  });

  if (client.length <= 0) {
    res.status(404).json({
      status: false,
      message: 'Client not found!',
    });
  } else {
    const data = client.map((e) => {
      return {
        id: e.id,
        userId: e.userId,
        username: e.User.username,
        formatMessage: e.FormatMessage.messageType,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
    });
    res.status(200).json({
      status: true,
      message: 'Client Found!',
      data: data,
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

  const superAdmin = await User.findOne({
    where: {
      id: req.user.id, 
      roleId: 1, 
    },
  });

  if (!superAdmin) {
    return res.status(403).json({
      status: false,
      message: 'Permission Denied! Only super admins can modify users.',
    });
  }

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
        message: 'You must provide either a new username or password to update.',
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
        }
      );

      res.status(200).json({
        status: true,
        message: 'User updated successfully',
      });
    }
  }
});

exports.selfModify = catchAsync(async (req, res) => {
  const userId = req.user.id; // Get the user's ID from the authenticated user

  const user = await User.findOne({
    where: {
      id: userId,
      roleId: {
        [Op.in]: [2, 3],
      },
    },
  });

  if (!user) {
    return res.status(401).json({
      status: false,
      message: 'User not found or unauthorized to modify data',
    });
  }

  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.update(
    {
      password: hashedPassword,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  res.status(200).json({
    status: true,
    message: 'User data modified successfully',
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

exports.logout = (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized: No token provided',
    });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized: Invalid token',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Logout successful',
    });
  });
};
