const catchAsync = require('../util/catchAsync');
const axios = require('axios');

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
    },
  };

  try {
    const response = await axios.post(
      'http://10.14.136.31:27010/jsonAPI/v1/inquiry',
      data,
      config,
    );

    res.json({ message: 'oke' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
