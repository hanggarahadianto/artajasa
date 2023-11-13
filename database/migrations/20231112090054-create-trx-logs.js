'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TrxLogs', {
      issuerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cpan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      acquirerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mpan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      processCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tansactionAmount: {
        type: Sequelize.STRING
      },
      tipAmount: {
        type: Sequelize.STRING
      },
      referenceNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      invoiceNumber: {
        type: Sequelize.STRING
      },
      testCaseCode: {
        type: Sequelize.STRING
      },
      testToolType: {
        type: Sequelize.STRING
      },
      responseCode: {
        type: Sequelize.STRING
      },
      responseMessage: {
        type: Sequelize.STRING
      },
      messageType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      messageCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rawBody: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      operationalId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TrxLogs');
  }
};