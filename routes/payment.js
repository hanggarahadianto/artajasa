var express = require('express');
const {
  addPayment,
  addPaymentQrisIssuer,
} = require('../app/controllers/paymentController');
var router = express.Router();

router.post('/', addPaymentQrisIssuer);

module.exports = router;
