'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const { User, UserRole } = require('../../database/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userId = uuidv4();
    const username = 'SuperAdmin';
    const password = 'SuperAdmin';

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        id: userId,
        username,
        password: hashedPassword,
      });

      const userRole = await UserRole.create({
        userId: user.id,
        roleId: 1,
      });

      console.log('SuperAdmin user created successfully.');
    } catch (error) {
      console.error('Error creating SuperAdmin:', error);
    }
  },

  down: (queryInterface, Sequelize) => {},
};
