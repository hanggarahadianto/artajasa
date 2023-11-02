const catchAsync = require('../util/catchAsync');
const axios = require('axios');
const path = require('path');
const qrcode = require('qrcode');
const fs = require('fs').promises;
const net = require('net');

const { QrCode } = require('../../database/models');

const { SVIP_URL } = process.env;

exports.addInquiry = catchAsync(async (req, res) => {
  const {
    TimeStamp,
    sequenceNumber,
    forwardingID,
    issuerID,
    functionMode,
    QRCRawData,
    date,
    signature,
  } = req.body;

  const data = {
    QRInquiryRQ: {
      TimeStamp,
      sequenceNumber,
      forwardingID,
      issuerID,
      functionMode,
      QRCRawData,
    },
  };

  const config = {
    headers: {
      Date: date,
      Signature: signature,
    },
  };

  try {
    const response = await axios.post(`${SVIP_URL}/inquiry`, data, config);
    const responseData = response.data.QRInquiryQrisRS;

    if (responseData.responseCode != '00') {
      res
        .status(400)
        .json({ status: false, message: 'Error', response: response.data });
    }

    res.json({ status: true, response: response.data });
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

exports.generateQR = async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;

  const data = {
    QRCRawData1:
      '00020101021151450015ID.OR.GPNQR.WWW0215ID10190000000990303UME520458125303360540810000.005502015802ID5921BAKSO MALANG MAS NANO6013JAKARTA PUSAT61051034062140710A000000001630439ED',
    QRCRawData2:
      '00020101021151450015ID.OR.GPNQR.WWW0215ID10190000000990303UME520458125303360540810000.005502015802ID5921BAKSO MALANG MAS NANO6013JAKARTA PUSAT61051034062140710A000000001630439ED',
  };

  try {
    const qrData = id === '1' ? data.QRCRawData1 : data.QRCRawData2;
    const qrImage = await qrcode.toDataURL(qrData);

    const timestamp = new Date().getTime();
    const fileName = `qrcode_${timestamp}_${clientId}.png`;

    const filePath = path.join(__dirname, '..', '..', 'public', 'qr', fileName);

    await fs.writeFile(
      filePath,
      qrImage.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );

    const host = req.get('host');
    const protocol = req.protocol;

    const dataQr = await QrCode.create({
      clientId,
      src: `${protocol}://${host}/qr/${fileName}`,
    });

    res.status(201).json({
      status: true,
      message: 'QR Generate succesfully',
      data: dataQr,
    });
  } catch (error) {
    console.error('Error generating QR Code:', error);
    res.status(400).json({ error: 'Failed to generate QR Code' });
  }
};
