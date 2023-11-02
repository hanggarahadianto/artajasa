const Joi = require('joi');
const qrcode = require('qrcode');
const catchAsync = require('../util/catchAsync');
const path = require('path');
const fs = require('fs').promises;
const {
  User,
  UserRole,
  Role,
  Client,
  QrCode,
} = require('../../database/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getAllInquiryMpanQR = catchAsync(async (req, res) => {
  const data = await QrCode.findAll({
    where: {
      name: 'InquiryMpanAcquirer',
    },
  });

  if (data.length <= 0) {
    res.status(404).json({
      status: false,
      message: 'QR not found!',
    });
  } else {
    res.status(200).json({
      status: true,
      message: 'Success get all QR',
      data: data,
    });
  }
});

exports.generateQRInquiryMpanAcquirer = async (req, res) => {
  const { id } = req.params;
  const name = 'InquiryMpanAcquirer';

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
    const fileName = `qrcode_${timestamp}_${name}.png`;

    const filePath = path.join(__dirname, '..', '..', 'public', 'qr', fileName);

    await fs.writeFile(
      filePath,
      qrImage.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );

    const host = req.get('host');
    const protocol = req.protocol;

    const dataQr = await QrCode.create({
      id: `${name}${fileName}`,
      name,
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

exports.deleteQRInquiryMpanAcquirer = catchAsync(async (req, res) => {
  const qr = await QrCode.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!qr) {
    res.status(404).json({
      status: false,
      message: "QR with id isn't found!",
    });
  } else {
    await QrCode.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(201).json({
      status: true,
      message: 'Delete success',
    });
  }
});
