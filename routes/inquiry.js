var express = require('express');
const {
  addInquiry,
  addInquiryIso,
  generateQR,
} = require('../app/controllers/inquiryController');
const { auth } = require('../app/middlewares/restrict');
const { isClient } = require('../app/middlewares/rbac');
var router = express.Router();

router.post('/', addInquiry);
router.post('/iso', addInquiryIso);
router.post('/qr-generate/:id', auth, isClient, generateQR);

module.exports = router;
