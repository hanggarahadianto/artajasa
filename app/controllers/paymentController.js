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

function parseTLV(sTlvData) {
  const mResult = {};
  let iOffset = 0;

  while (iOffset < sTlvData.length) {
    const tag = sTlvData.substring(iOffset, iOffset + 2);
    iOffset += 2;

    const lengthStr = sTlvData.substring(iOffset, iOffset + 2);
    const length = parseInt(lengthStr, 10);
    iOffset += 2;

    const value = sTlvData.substring(iOffset, iOffset + length);
    iOffset += length;

    mResult[tag] = { length: lengthStr, value: value };
  }

  return mResult;
}

function processTags(result, start, end) {
  let parsedData = [];

  for (let i = start; i <= end; i++) {
    const tag = result[i.toString()];
    if (tag) {
      const parsedValue = parseTLV(tag.value);
      const extractedData = {};
      Object.keys(parsedValue).forEach((key) => {
        extractedData[key] = parsedValue[key]?.value ?? null;
      });
      parsedData.push(extractedData);
    }
  }

  if (parsedData.length === 0) {
    parsedData = null;
  }

  return parsedData;
}

function processTag(result, selectedTag) {
  const tag = result[selectedTag];

  if (!tag || !tag.value) {
    return null;
  }

  console.log(tag.value);

  const parsedValue = parseTLV(tag.value);
  const extractedData = {};
  Object.keys(parsedValue).forEach((key) => {
    extractedData[key] = parsedValue[key]?.value ?? null;
  });

  return extractedData;
}

function getTagValues(result, startTag, endTag) {
  const tagValues = {};

  for (let i = startTag; i <= endTag; i++) {
    const tagName = i.toString().padStart(2, '0');

    tagValues[`i${tagName}`] = result[tagName]?.value ?? null;
  }

  return tagValues;
}

exports.addPaymentQrisIssuer = catchAsync(async (req, res) => {
  const { sTlvData } = req.body;
  const result = parseTLV(sTlvData);
  let i51 = processTag(result, '51');
  let i62 = processTag(result, '62');

  let i64 = processTag(result, '64');
  let i0245 = processTags(result, 2, 45);
  let i4650 = processTags(result, 46, 50);
  let i5261 = getTagValues(result, 52, 61);

  const requestData = {
    issuerID: '93600147',
    fromAccount: '9360014700100102129',
    destinationMsgType: 'json',
    QRCParsedData: {
      i00: result['00']?.value ?? null,
      i01: result['01']?.value ?? null,
      i0245,
      i4650,
      i51,
      ...i5261,
      i62,
      i63: result['63']?.value ?? null,
      i64,
    },
  };

  res.status(200).json({
    status: 'okey',
    response: {
      requestData,
    },
  });
});
