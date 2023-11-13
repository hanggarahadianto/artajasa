const {
  User,
  UserRole,
  Role,
  FormatMessage,
  Admin,
  Client,
  AdminClient,
  qrTest,
  TrxLogs,
} = require("../../database/models");
const catchAsync = require("../util/catchAsync");

exports.getReportTransaction = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const TrxLogsData = await TrxLogs.findAll({
    attributes: [
      "transactionCode",
      "processCode",
      "acquirerId",
      "mpan",
      "issuerId",
      "cpan",
      "referenceNumber",
      "transactionAmount",
      "tipAmount",
      "responseCode",
      "responseMessage",
      "operationalId",
    ],
  });

  const dataReport = TrxLogsData.map((data) => ({
    transactionCode: data.transactionCode,
    processCode: data.processCode,
    acquirerId: data.acquirerId,
    mpan: data.mpan,
    issuerId: data.issuerId,
    cpan: data.cpan,
    referenceNumber: data.referenceNumber,
    transactionAmount: data.transactionAmount,
    tipAmount: data.tipAmount,
    responseCode: data.responseCode,
    responseMessage: data.responseMessage.replace(/[\[\]\\"]/g, ""),
    operationalId: data.operationalId,
  }));

  if (dataReport.length <= 0) {
    res.status(404).json({
      status: false,
      message: "Data not found!",
    });
  } else {
    res.status(200).json({
      status: true,
      message: "Get Report Transaction Data Success",
      data: dataReport,
    });
  }
});

exports.getReportDetail = catchAsync(async (req, res) => {
  const TrxDetails = await TrxLogs.findAll({
    attributes: [
      "issuerId",
      "cpan",
      "acquirerId",
      "mpan",
      "transactionCode",
      "processCode",
      "referenceNumber",
      "transactionAmount",
      "tipAmount",
      "referenceNumber",
      "invoiceNumber",
      "testCaseCode",
      "testToolType",
      "responseCode",
      "responseMessage",
      "messageType",
      "messageCode",
      "rawBody",
      "operationalId",
      "createdAt",
      "createdBy",
      "updatedAt",
    ],
  });

  const dataReport = TrxDetails.map((data) => ({
    issuerId: data.issuerId,
    cpan: data.cpan,
    acquirerId: data.acquirerId,
    mpan: data.mpan,
    transactionCode: data.transactionCode,
    processCode: data.processCode,
    referenceNumber: data.referenceNumber,
    invoiceNumber: data.invoiceNumber,
    transactionAmount: data.transactionAmount,
    tipAmount: data.tipAmount,
    testCaseCode: data.testCaseCode,
    testToolType: data.testToolType,
    responseCode: data.responseCode,
    responseMessage: data.responseMessage.replace(/[\[\]\\"]/g, ""),
    messageType: data.messageType,
    messageCode: data.messageCode,
    rawBody: data.rawBody,
    operationalId: data.operationalId,
    createdAt: data.createdAt,
    createdBy: data.createdBy,
    updatedAt: data.updatedAt,
  }));

  if (dataReport.length <= 0) {
    res.status(404).json({
      status: false,
      message: "Data not found!",
    });
  } else {
    res.status(200).json({
      status: true,
      message: "Get Report Transaction Data Success",
      data: dataReport,
    });
  }
});
