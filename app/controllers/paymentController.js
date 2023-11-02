const catchAsync = require('../util/catchAsync');
const axios = require('axios');

const { SVIP_URL } = process.env;

exports.addPayment = catchAsync(async (req, res) => {
  const {
    msgType,
    trxPAN,
    trxCode,
    trxAmount,
    transmissionDateTime,
    msgSTAN,
    trxTime,
    trxDate,
    settlementDate,
    captureDate,
    merchantType,
    posEntryMode,
    trxFeeAmount,
    acquirerID,
    forwardingID,
    retrievalReferenceNumber,
    approvalCode,
    terminalID,
    merchantID,
    merchantNameLocation,
    additionalDataPrivate,
    trxCurrencyCode,
    additionalDataNational,
    issuerID,
    fromAccount,
    date,
    signature,
  } = req.body;

  const data = {
    QRPaymentCreditRQ: {
      msgType,
      trxPAN,
      trxCode,
      trxAmount,
      transmissionDateTime,
      msgSTAN,
      trxTime,
      trxDate,
      settlementDate,
      captureDate,
      merchantType,
      posEntryMode,
      trxFeeAmount,
      acquirerID,
      forwardingID,
      retrievalReferenceNumber,
      approvalCode,
      terminalID,
      merchantID,
      merchantNameLocation,
      additionalDataPrivate,
      trxCurrencyCode,
      additionalDataNational,
      issuerID,
      fromAccount,
    },
  };

  const config = {
    headers: {
      Date: date,
      Signature: signature,
    },
  };

  try {
    const response = await axios.post(`${SVIP_URL}/paycredit`, data, config);

    res.json({ status: true, message: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
