const catchAsync = require('../util/catchAsync');
const axios = require('axios');

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

    res.json({ status: true, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
