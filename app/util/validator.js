const Joi = require('joi');

const { User } = require('../../database/models');

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

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

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
  roleType: Joi.number().required(),
});

const adminSchema = Joi.object({
  name: Joi.string().min(5).max(255).required(),
});

const clientSchema = Joi.object({
  adminIds: Joi.required(),
  institutionCode: Joi.string().length(6).required(),
  formatMessageId: Joi.number().required(),
});

module.exports = {
  userSchema,
  adminSchema,
  clientSchema,
};
