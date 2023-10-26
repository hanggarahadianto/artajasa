var express = require("express");
const { addPayment } = require("../app/controllers/paymentController");
var router = express.Router();

router.post("/", addPayment);

module.exports = router;
