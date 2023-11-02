const catchAsync = require('../util/catchAsync');
const axios = require('axios');
const net = require('net');
const crypto = require('crypto');

const { SVIP_URL } = process.env;

exports.simulatorInquiryQrMpan = catchAsync(async (req, res) => {
  const { QRCRawData } = req.body;

  const data = {
    QRInquiryRQ: {
      TimeStamp: '20200120102247',
      sequenceNumber: '200120102247',
      forwardingID: '360001',
      issuerID: '93600911',
      functionMode: 'IQ02',
      QRCRawData,
    },
  };

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

  const nowdate = `${day}, ${date} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;

  const requestBody = QRCRawData.replace(/\s+/g, '').toUpperCase();
  const secretKey = 'testsecret';
  const combinedString = `${requestBody}:${nowdate}`;
  const hmac = crypto.createHmac('sha512', secretKey);
  hmac.update(combinedString, 'utf-8');
  const generatedHmac = hmac.digest('base64');

  const config = {
    headers: {
      Date: nowdate,
      Signature: generatedHmac,
    },
  };

  try {
    const response = await axios.post(
      `http://10.14.136.31:27010/jsonAPI/v1/inquiry`,
      data,
      config,
    );
    const responseData = response.data.QRInquiryQrisRS;

    if (responseData.responseCode !== '00') {
      res
        .status(400)
        .json({ status: false, message: 'Error', response: response.data });
    } else {
      res.json({ status: true, response: response.data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

exports.addInquiryIso = async (req, res) => {
  const isoData = {
    MTI: '0210',
    2: '9360000019000000118',
    3: '371000',
    4: '000000000000',
    7: '0420080820',
    11: '002868',
    12: '150819',
    13: '0420',
    15: '0421',
    17: '0420',
    18: '5812',
    22: '012',
    32: '93600000',
    33: '360001',
    37: '210420004859',
    38: '000000',
    39: '00',
    41: 'A000000001',
    42: 'ID1119000000118',
    48: 'PI04IQ02',
    49: '360',
    57: '26430117936001180010010010211345678987540303UME',
    100: '93600152',
    102: '9360015270000074105',
  };

  // Convert ISO data to a formatted string (ISO 8583 message)
  const isoMessage = Object.keys(isoData)
    .map((key) => `${key}=${isoData[key]}`)
    .join('&');

  // Display ISO message before sending
  console.log('ISO 8583 message to be sent:');
  console.log(isoMessage);

  const simulatedResponse = 'ISO_RESP=SUCCESS';

  try {
    // Ubah sesuai kebutuhan Anda
    const URL = `http://10.14.136.31:26010/inquiry`;
    const response = await axios.post(URL, isoMessage);

    if (response.data.responseCode !== '00') {
      return res
        .status(400)
        .json({ status: false, message: 'Error', response: response.data });
    }

    return res.json({ status: true, response: response.data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  // Kirim respons API dengan respon simulasi
  // res.status(200).json({ response: simulatedResponse, iso: isoMessage });
};
