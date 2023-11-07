const { createUserWithRole } = require('./userService');
const { Admin, User } = require('../../database/models');
const { userSchema, adminSchema } = require('../util/validator');

async function createAdmin({ username, password, name }) {
  const roleType = 2;
  await userSchema.validateAsync({ username, password }, { abortEarly: false });

  await adminSchema.validateAsync({ name }, { abortEarly: false });

  const user = await createUserWithRole({ username, password, roleType });
  if (!user.success) {
    return { success: false, error: user.error };
  }

  try {
    const newAdmin = await Admin.create({
      id: user.user.id,
      userId: user.user.id,
      name,
    });

    return { success: true, newAdmin };
  } catch (error) {
    await User.destroy({ where: { id: user.user.id } });
    return { success: false, error: error.message };
  }
}

module.exports = { createAdmin };
