const Joi = require('joi');
const { User } = require('../../database/models');
const catchAsync = require('../util/catchAsync');
const bcrypt = require('bcrypt');

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
});

exports.addUser = catchAsync(async (req, res) => {
  const { username, password, role } = req.body;

  await userSchema.validateAsync(req.body, { abortEarly: false });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    role,
  });

  res.status(200).json({
    status: true,
    message: 'User berhasil ditambahkan',
    data: user,
  });
});
