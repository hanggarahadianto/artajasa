var express = require('express');
const {
  addInquiryIso,
  simulatorInquiryQrMpan,
} = require('../app/controllers/inquiryController');
const { auth } = require('../app/middlewares/restrict');
const { isClient } = require('../app/middlewares/rbac');
var router = express.Router();

// router.post('/simulator/mpan', simulatorInquiryQrMpan);
// router.post('/iso', addInquiryIso);

module.exports = router;
