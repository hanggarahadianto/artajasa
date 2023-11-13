"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TrxLogs", {
      issuerId: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      cpan: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      acquirerId: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      mpan: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      transactionCode: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      processCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      transactionAmount: {
        type: Sequelize.STRING(20),
      },
      tipAmount: {
        type: Sequelize.STRING(20),
      },
      referenceNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      invoiceNumber: {
        type: Sequelize.STRING(30),
      },
      testCaseCode: {
        type: Sequelize.STRING(10),
      },
      testToolType: {
        type: Sequelize.STRING(30),
      },
      responseCode: {
        type: Sequelize.STRING(5),
      },
      responseMessage: {
        type: Sequelize.TEXT,
      },
      messageType: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      messageCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      rawBody: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      operationalId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TrxLogs");
  },
};
