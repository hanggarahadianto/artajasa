const { User, UserRole, Admin, Role } = require('../../database/models');
const catchAsync = require('../util/catchAsync');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { createUserWithRole } = require('../services/userService');
const { userSchema } = require('../util/validator');

exports.addSuperAdmin = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const roleType = 1;

  await userSchema.validateAsync(
    { username, password, roleType },
    { abortEarly: false },
  );
  const result = await createUserWithRole({
    username,
    password,
    roleType,
  });

  if (result.success) {
    res.status(201).json({
      status: true,
      message: 'User client created',
      data: result,
    });
  } else {
    res.status(400).json({ status: false, error: result.error });
  }
});

exports.getAllSuperAdmin = catchAsync(async (req, res) => {
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
          roleId: 1,
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
      {
        model: Admin,
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
      //admin: e.Admin.name,
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

exports.getAllClient = catchAsync(async (req, res) => {
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
          roleId: 3,
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
    message: 'Success Get All Client',
    currentPage: page,
    totalItems: users.count,
    totalPages: Math.ceil(users.count / limit),
    data,
  });
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

exports.deleteSuperAdmin = catchAsync(async (req, res) => {
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
    const userRolesDeleted = await UserRole.destroy({
      where: {
        userId: user.id,
      },
    });
    const data = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: true,
      message: 'User berhasil dihapus',
      data: data,
      userRolesDeleted: userRolesDeleted,
    });
  }
});

exports.restoreUser = catchAsync(async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
      status: 'deactive',
    },
  });
  if (!user) {
    res.status(400).json({
      status: false,
      message: 'User not found! or already active',
    });
  } else {
    user.status = 'active';
    await user.save();
    res.status(200).json({
      status: true,
      message: 'User restore successfully',
      data: user,
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

exports.SelfModify = catchAsync(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      status: false,
      message: 'Permission Denied! Only super admins can perform this action.',
    });
  }

  const targetUser = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  if (!targetUser) {
    return res.status(404).json({
      status: false,
      message: 'Your account is not found or is not a "SuperAdmin" role.',
    });
  }

  const isOldPasswordCorrect = await bcrypt.compare(
    oldPassword,
    targetUser.password,
  );

  if (!isOldPasswordCorrect) {
    return res.status(400).json({
      status: false,
      message: 'Old password is incorrect',
    });
  }

  if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
    return res.status(400).json({
      status: false,
      message: 'New password and confirm password must match and not be empty',
    });
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  if (!passwordPattern.test(newPassword)) {
    return res.status(400).json({
      status: false,
      message:
        'Password must be a combination of uppercase and lowercase letters, and numbers with a minimum length of 6 characters.',
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.update(
    { password: hashedPassword },
    {
      where: {
        id: req.user.id,
      },
    },
  );

  res.status(200).json({
    status: true,
    message: 'User data modified successfully',
  });
});
