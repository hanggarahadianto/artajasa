"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change the data type of the price column to STRING
    await queryInterface.changeColumn("TrxLogs", "rawBody", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Change the data type back to FLOAT if needed
    await queryInterface.changeColumn("TrxLogs", "rawBody", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
