const Joi = require('joi');
const { User } = require('../../database/models');
const catchAsync = require('../util/catchAsync');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { Op, where } = require('sequelize');

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
      'Password harus kombinasi huruf besar, huruf kecil, dan angka',
  }),
  role: Joi.string().valid('admin', 'client').required(),
  status: Joi.string().valid('active', 'deactive').required(),
});

const { JWT_SECRET_KEY } = process.env;

exports.addUser = catchAsync(async (req, res) => {
  const { username, password, role, status } = req.body;

  await userSchema.validateAsync(req.body, { abortEarly: false });

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = uuidv4();

  const user = await User.create({
    id: userId,
    username,
    password: hashedPassword,
    role,
    status,
  });

  res.status(200).json({
    status: true,
    message: 'User berhasil ditambahkan',
    data: user,
  });
});

exports.login = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
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
      if (user.status != 'active') {
        res.status(400).json({
          status: false,
          message: 'Your account has suspended!',
        });
      } else {
        payload = {
          id: user.id,
          username: user.username,
          role: user.role,
          status: user.status,
        };

        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '30m' });

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

// Fungsi untuk mendapatkan semua pengguna
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    where: {
      role: 'client', // Ubah ke 'client' untuk hanya menampilkan pengguna dengan peran 'client'
    },
  });

  res.status(200).json({
    status: true,
    message: 'All client users',
    data: users,
  });
});

exports.terUser = catchAsync(async (req, res) => {
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

// Fungsi modifikasi pengguna
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    where: {
      role: 'client', // Ubah ke 'client' untuk hanya menampilkan pengguna dengan peran 'client'
    },
  });

  res.status(200).json({
    status: true,
    message: 'All client users',
    data: users,
  });
});

exports.terUser = catchAsync(async (req, res) => {
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

// Fungsi modifikasi pengguna
exports.modifyUser = async (req, res) => {
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
};

// Fungsi modify self
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

exports.whoami = catchAsync(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    status: true,
    message: 'succes',
    data: user,
  });
});
