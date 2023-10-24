const Joi = require('joi');
const { User } = require('../../database/models');
const catchAsync = require('../util/catchAsync');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

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

exports.terUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    res.status(404).json({
      status: false,
      message: 'User not found',
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

// Fungsi pencarian pengguna
exports.searchUser = catchAsync(async (req, res) => {
  const { username } = req.params;
  const user = await User.findByUsername(username);

  if (!user) {
    res.status(404).json({
      status: false,
      message: 'User not found!',
    });
  } else {
    res.status(200).json({
      status: true,
      message: 'User found',
      data: user,
    });
  }
});

// Fungsi modifikasi pengguna
exports.modifyUser = catchAsync(async (req, res) => {
  const { username } = req.params;
  const newData = req.body;

  const result = await User.updateUser(username, newData);

  if (result[0] === 0) {
    res.status(404).json({
      status: false,
      message: 'User not found!',
    });
  } else {
    res.status(200).json({
      status: true,
      message: 'User updated successfully',
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
