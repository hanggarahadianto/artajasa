'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin5', 10);

    return queryInterface.bulkInsert('Users', [
      {
        id: 'b65f08d0-f95b-49ad-a2b9-822e764b3ec6',
        username: 'Admin5',
        password: hashedPassword,
        role: 'client',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {},
};
