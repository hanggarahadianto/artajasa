"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("TrxLogs", "logPosition", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "settlementAmount", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "accHolderAmount", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "transmissionDateTime", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "settlementConversionRate", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "accHolderConversionRate", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "msgSTAN", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "trxTime", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "trxDate", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "settlementDate", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "conversionDate", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "captureDate", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "merchantType", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "posEntryMode", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "forwardingId", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "approvalCode", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "terminalId", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "merchantId", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "merchantNameLocation", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "additionalDataPrivate", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "trxCurrencyCode", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "settlementCurrencyCode", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "accHolderCurrencyCode", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn("TrxLogs", "additionalDataNational", {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
