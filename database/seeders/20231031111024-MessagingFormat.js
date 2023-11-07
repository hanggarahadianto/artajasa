'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('FormatMessages', [
      {
        id: 1,
        messageType: 'JSON',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        messageType: 'ISO',
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
