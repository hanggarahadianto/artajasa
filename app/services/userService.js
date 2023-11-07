const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { User, UserRole } = require('../../database/models');

async function createUserWithRole({ username, password, roleType }) {
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      id: userId,
      username,
      password: hashedPassword,
    });

    const userRole = await UserRole.create({
      userId: newUser.id,
      roleId: roleType,
    });

    return { success: true, user: newUser, userRole: userRole };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { createUserWithRole };
