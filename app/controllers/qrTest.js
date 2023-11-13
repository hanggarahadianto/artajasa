

const { qrTest } = require('../../database/models');
const { v4: uuidv4 } = require('uuid');

exports.requestQR = async (req, res) => {
    const {  amount, tipAmount } = req.body;
    try {

      const reqQr = await qrTest.create({
        qrString: uuidv4(),
        amount,
        tipAmount

      });
  
      res.status(201).json({
        status: true,
        message: 'QR Generate successfully',
        data: reqQr,
      });
    } catch (error) {
      console.error('Error generating QR Code:', error);
      res.status(400).json({ error: 'Failed to generate QR Code' });
    }
  };