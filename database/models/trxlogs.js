'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrxLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TrxLogs.init({
    issuerId: DataTypes.STRING,
    cpan: DataTypes.STRING,
    acquirerId: DataTypes.STRING,
    mpan: DataTypes.STRING,
    transactionCode: DataTypes.STRING,
    processCode: DataTypes.STRING,
    tansactionAmount: DataTypes.STRING,
    tipAmount: DataTypes.STRING,
    referenceNumber: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    testCaseCode: DataTypes.STRING,
    testToolType: DataTypes.STRING,
    responseCode: DataTypes.STRING,
    responseMessage: DataTypes.STRING,
    messageType: DataTypes.STRING,
    messageCode: DataTypes.STRING,
    rawBody: DataTypes.STRING,
    operationalId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TrxLogs',
  });
  return TrxLogs;
};