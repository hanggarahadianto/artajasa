const catchAsync = require('../util/catchAsync');
const axios = require('axios');
const crypto = require('crypto');

const { SVIP_URL } = process.env;

function generateHMAC(data, date, secretKey) {
  const combinedString = `${data}:${date}`;
  const hmac = crypto.createHmac('sha512', secretKey);
  hmac.update(combinedString, 'utf-8');
  return hmac.digest('base64');
}

// Fungsi untuk menentukan tanggal dalam format tertentu
function getFormattedDate() {
  const now = new Date();
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
    now.getUTCDay()
  ];
  const date = now.getUTCDate();
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][now.getUTCMonth()];
  const year = now.getUTCFullYear();
  const hours = now.getUTCHours().toString().padStart(2, '0');
  const minutes = now.getUTCMinutes().toString().padStart(2, '0');
  const seconds = now.getUTCSeconds().toString().padStart(2, '0');

  return `${day}, ${date} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

function parseQRString(qrString) {
  const parsedData = {
    msgType: '0200',
    trxPAN: qrString.slice(38, 53),
    trxCode: qrString.slice(56, 62),
    trxAmount: qrString.slice(65, 70),
    transmissionDateTime: qrString.slice(),
    msgSTAN: qrString.slice(60, 66),
    trxTime: qrString.slice(66, 72),
    trxDate: qrString.slice(72, 76),
    settlementDate: qrString.slice(76, 80),
    captureDate: qrString.slice(80, 84),
    merchantType: qrString.slice(84, 88),
    posEntryMode: qrString.slice(88, 91),
    trxFeeAmount: qrString.slice(91, 100),
    acquirerID: qrString.slice(100, 108),
    forwardingID: qrString.slice(108, 114),
    retrievalReferenceNumber: qrString.slice(114, 128),
    approvalCode: qrString.slice(128, 134),
    terminalID: qrString.slice(134, 150),
    merchantID: qrString.slice(150, 164),
    merchantNameLocation: qrString.slice(164, 279).trim(),
    additionalDataPrivate: qrString.slice(279, 309),
    trxCurrencyCode: qrString.slice(309, 312),
    additionalDataNational: qrString.slice(312, 332),
    issuerID: qrString.slice(332, 340),
    fromAccount: qrString.slice(340, 364),
  };

  return parsedData;
}

exports.addPayment = catchAsync(async (req, res) => {
  const { qrString } = req.body;

  try {
    const msgType = qrString.substring(0, 4);
    const trxPAN = qrString.substring(8, 28);
    const trxCode = qrString.substring(28, 34);

    const parsedData = parseQRString(qrString);

    const data = {
      QRPaymentCreditRQ: {
        msgType,
        trxPAN,
        trxCode,
      },
    };

    const nowdate = getFormattedDate();
    const requestBody = qrString.replace(/\s+/g, '').toUpperCase();
    const secretKey = 'testsecret';
    const generatedHmac = generateHMAC(requestBody, nowdate, secretKey);

    const config = {
      headers: {
        Date: nowdate,
        Signature: generatedHmac,
      },
    };

    //const response = await axios.post(`${SVIP_URL}/paycredit`, data, config);

    res.json({ status: true, message: parsedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
