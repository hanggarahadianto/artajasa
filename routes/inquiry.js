var express = require('express');
const { addInquiry } = require('../app/controllers/inquiryController');
var router = express.Router();

router.post('/', addInquiry);

module.exports = router;
