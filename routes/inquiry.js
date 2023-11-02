var express = require('express');
const {
  addInquiry,
  addInquiryIso,
} = require('../app/controllers/inquiryController');
const { auth } = require('../app/middlewares/restrict');
const { isClient } = require('../app/middlewares/rbac');
var router = express.Router();

router.post('/', addInquiry);
router.post('/iso', addInquiryIso);

module.exports = router;
