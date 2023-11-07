'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        roleName: 'SuperAdmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        roleName: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        roleName: 'Client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
