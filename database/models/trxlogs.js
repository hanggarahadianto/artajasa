"use strict";
const { Model } = require("sequelize");
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
  TrxLogs.init(
    {
      issuerId: DataTypes.STRING,
      cpan: DataTypes.STRING,
      acquirerId: DataTypes.STRING,
      mpan: DataTypes.STRING,
      transactionCode: DataTypes.STRING,
      processCode: DataTypes.STRING,
      transactionAmount: DataTypes.STRING,
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
      createdBy: DataTypes.STRING,
      operationalId: DataTypes.STRING,
      logPosition: DataTypes.STRING,
      settlementAmount: DataTypes.STRING,
      accHolderAmount: DataTypes.STRING,
      transmissionDateTime: DataTypes.STRING,
      settlementConversionRate: DataTypes.STRING,
      accHolderConversionRate: DataTypes.STRING,
      msgSTAN: DataTypes.STRING,
      trxTime: DataTypes.STRING,
      trxDate: DataTypes.STRING,
      settlementDate: DataTypes.STRING,
      conversionDate: DataTypes.STRING,
      captureDate: DataTypes.STRING,
      merchantType: DataTypes.STRING,
      posEntryMode: DataTypes.STRING,
      forwardingId: DataTypes.STRING,
      approvalCode: DataTypes.STRING,
      terminalId: DataTypes.STRING,
      merchantId: DataTypes.STRING,
      merchantNameLocation: DataTypes.TEXT,
      additionalDataPrivate: DataTypes.TEXT,
      trxCurrencyCode: DataTypes.STRING,
      settlementCurrencyCode: DataTypes.STRING,
      accHolderCurrencyCode: DataTypes.STRING,
      additionalDataNational: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "TrxLogs",
    }
  );
  return TrxLogs;
};
